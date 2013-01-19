var OAuth = require('oauth').OAuth;

module.exports = {

    /*
     * Attributes
     */

    manager: null,
    oauth: null,

    /*
     * Initialization
     */

    init: function(config, manager) {
        this.manager = manager;
        this.oauth = new OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            config.application.consumer_key,
            config.application.consumer_secret,
            '1.0',
            config.application.callback_url,
            'HMAC-SHA1'
        );

        // We need to redefine the "this" reference or the controllers won't find the "oauth" object
        for(var i in this.controllers) {
            this.controllers[i] = this.controllers[i](this);
        }
    },

    /*
     * Controllers : each controller needs to be inside a closure so the "this" keyword could be avoided
     * and the "_this" reference will be used instead
     */

    controllers: {

        auth: function(_this) {
            return function(req, res, next) {
                _this.oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret) {
                    if(!error) {
                        req.session.token = oauth_token;
                        req.session.token_secret = oauth_token_secret;
                        res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
                    }
                    else {
                        console.log('Request token failure'); // We need to log this, it's an important error.
                        next(); // Sends to the route displaying the issue to the client
                    }
                });
            };
        },

        callback: function(_this) {
            return function(req, res, next) {
                if(req.session.token) {

                    var oauth = req.session;
                    req.session.verifier = req.query.oauth_verifier;

                    _this.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,

                        function(error, oauth_access_token, oauth_access_token_secret, results){
                            if(!error){
                                req.session.id = results.user_id;

                                // These are now longer necessary :
                                req.session.token = null;
                                req.session.token_secret = null;

                                // We inform the manager that this user can be used
                                _this.manager.set(results.user_id, {
                                    name: results.screen_name,
                                    access_token: oauth_access_token,
                                    access_token_secret: oauth_access_token_secret
                                });

                                res.locals.status = 0; // 0 = OK
                            } else {
                                res.locals.status = 1; // 1 = No access to the user
                            }

                            next();
                        }

                    );

                } else {
                    res.locals.status = 2; // 2 = Forbidden
                    next();
                }
            };
        }
    }

};
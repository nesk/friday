/*
    The Twitter module manages tweets for the primary account and
    retweets for the users.
*/

var Twit = require('twit');

module.exports = {

    /*
     * Attributes
     */

    config: {},
    manager: null,
    primaryAccount: null,

    /*
     * Initialization
     */

    init: function(config, manager) {
        this.manager = manager;
        this.config = config;

        this.primaryAccount = new Twit({
            consumer_key: config.application.consumer_key,
            consumer_secret: config.application.consumer_secret,
            access_token: config.primary_account.access_token,
            access_token_secret: config.primary_account.access_token_secret
        });
    },

    /*
     * Tweets
     */

    tweet: function(user) {
        var _this = this,
            params = {
                status: this.config.message +' '+ this.config.domain
            };

        this.primaryAccount.post('statuses/update', params, function(err, reply) {
            if(err) {
                _this.handleError(err); // No need to specify the user, the error comes from the primary account
            } else {
                _this.retweet(reply.id_str, user);
            }
        });
    },

    retweet: function(tweetId, user) {
        var _this = this,
            account = new Twit({
                consumer_key: this.config.application.consumer_key,
                consumer_secret: this.config.application.consumer_secret,
                access_token: user.access_token,
                access_token_secret: user.access_token_secret
            });

        account.post('statuses/retweet/' + tweetId, function(err) {
            err && _this.handleError(err, user);
        });
    },

    /*
     * Error handler : displays the errors in the logs and ask for user removal if there's an error code 89 (invalid or expired token)
     */

    handleError: function(err, user) {
        var errors = JSON.parse(err.twitterReply).errors,
            consoleMsg = [
                'ERROR: HTTP Status Code ' + err.statusCode + ' for '
                + (user ? 'user ' + user.name + '[' + user.id + ']'
                        : 'primary account')
            ];

        for(var error89 = false, i = 0, error ; error = errors[i++] ;) {
            error89 = error.code == 89;
            consoleMsg.push('       Code ' + error.code + ': ' + error.message);
        }

        console.log(consoleMsg.join('\n'));

        if(error89) {
            if(user) { // A user has been specified, we just have to remove it.
                this.manager.unset(user);
            } else { // This means we can't access the primary account, yes we're pretty fucked here.
                console.log("FATAL ERROR: Can't access the primary account!");
                // In the future, a mail sent to the administrator could be a great idea.
            }
        }
    }

};
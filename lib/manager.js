/*
    The Manager module manages the user list (load/save), the submodules,
    also loads and distributes the application configuration.
*/

var path = require('path'),
    fs = require('fs');

module.exports = {

    /*
     * Submodules binded to the manager
     */

    submodules: {
        auth: require(path.join(process.cwd(), 'lib/auth')),
        trigger: require(path.join(process.cwd(), 'lib/trigger')),
        twitter: require(path.join(process.cwd(), 'lib/twitter'))
    },

    /*
     * Attributes
     */

    config: null,
    users: {},

    /*
     * Initialization
     */

    init: function(config) {
        this.config = config;
        this.config.users_file = path.join(process.cwd(), this.config.users_file);

        this.load(); // Load the users

        // Modules initialization
        var subs = this.submodules;
        subs.auth.init(config, this);
        subs.trigger.init(this.users, this, subs.twitter);
        subs.twitter.init(config, this);

        // We need to redefine the "this" reference or the controllers won't find the "set" function
        for(var i in this.controllers) {
            this.controllers[i] = this.controllers[i](this);
        }

        return this;
    },

    /*
     * Controllers : each controller needs to be inside a closure so the "this" keyword could be avoided
     * and the "_this" reference will be used instead
     */

    controllers: {

        settings: function(_this) {
            return function(req, res, next) {
                if(req.session.id) {
                    var utc = parseInt(req.body.utc),
                        hour = parseInt(req.body.hour);

                    if(!isNaN(utc) && !isNaN(hour)) {
                        _this.set(req.session.id, {
                            utc: utc,
                            hour: hour
                        });

                        res.locals.status = 0; // 0 = OK
                    } else {
                        res.locals.status = 1; // 1 = Incorrect arguments
                    }
                } else {
                    res.locals.status = 2; // 2 = Not authenticated
                }

                next();
            };
        }

    },

    /*
     * User list : loading / saving
     */

    load: function() {
        if(fs.existsSync(this.config.users_file)) {
            var data = fs.readFileSync(this.config.users_file, 'utf-8');
            this.users = JSON.parse(data);
        } else {
            console.log('No user list found at the specified location. A new one will be created.');
        }
    },

    save: function() {
        var data = JSON.stringify(this.users);
        fs.writeFile(this.config.users_file, data, 'utf-8', function(err) {
            err && console.log(err);
        });
    },

    /*
     * User list : management
     */

    set: function(id, details) {
        var user = this.users[id] || {
            id: id,
            name: '',
            access_token: '',
            access_token_secret: '',
            utc: 0,
            hour: 17
        };

        for(var i in user) {
            if(typeof details[i] != 'undefined') {
                user[i] = details[i];
            }
        }

        this.users[id] = user;
        this.save();

        this.submodules.trigger.set(user);

        console.log('NOTICE: User ' + user.name + '[' + id + '] has been set');
    },

    unset: function(user) {
        var id = user.id,
            name = user.name;

        this.submodules.trigger.unset(user);

        this.users[id] = null;
        this.save();

        console.log('NOTICE: User ' + name + '[' + id + '] has been unset');
    }

};
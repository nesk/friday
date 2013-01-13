var path = require('path'),
    fs = require('fs');

/*
    The Manager module manages the users list (load/save), the submodules,
    also loads and distributes the application configuration.
*/

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
        // this.trigger.init(); // Initiate the triggers

        return this;
    },

    /*
     * User list : loading / saving
     */

    load: function() {
        if(fs.existsSync(this.config.users_file)) {
            var data = fs.readFileSync(this.config.users_file, 'utf-8');
            this.users = JSON.parse(data);
        } else {
            console.log('No user list found at the specified location. Creating a new one.');
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

    set: function(details) {
        var user = {
            id: details.id,
            name: details.name,
            access_token: details.access_token,
            access_token_secret: details.access_token_secret,
            gmt: 0, // Default value
            hour: 17 // Default value
        };

        this.users[details.id] = user;
        this.save();

        // Tell the trigger that a user has been set
    },

    unset: function(id) {
        this.users[id] = null;

        // Tell the trigger that a user has been deleted
    }

};
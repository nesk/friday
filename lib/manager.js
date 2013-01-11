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
     * Loading / saving
     */

    load: function() {
        if(fs.existsSync(this.config.users_file)) {
            var data = fs.readFileSync(this.config.users_file, 'utf-8');
            this.users = JSON.parse(data);
        }
    },

    save: function() {
        var data = JSON.stringify(this.users);
        fs.writeFile(this.config.users_file, data, 'utf-8', function(err) {
            err && console.log(err);
        });
    }

};
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


};
/*
    The Trigger module manages the date calculations needed to know
    when we should tweet for a user.
*/

module.exports = {

    /*
     * Attributes
     */

    twitter: null,
    triggers: {},

    /*
     * Initialization
     */

    init: function(users, twitter) {
        this.twitter = twitter;

        this.loadWeeklyTweet();

        // All the triggers are set with this loop
        for(var id in users) {
            this.set(users[id]);
        }
    },

    /*
     * Triggers : management
     */

    // Sets the trigger for the weekly tweet
    loadWeeklyTweet: function() {
        var _this = this,
            offset = this.getDateOffset(-13, 0); // Tweets before the retweets, I don't know exactly when and I don't care :p

        setTimeout(function() {
            _this.twitter.postWeeklyTweet();
            _this.loadWeeklyTweet();
        }, offset);
    },

    // Sets one trigger for a user
    set: function(user) {
        var _this = this;

        // Clearing the timer if there's already one (for example, when you set the user parameters)
        clearTimeout(this.triggers[user.id]);

        this.triggers[user.id] = setTimeout(function() {
            _this.twitter.retweet(user); // Send the tweet
            _this.set(user); // We can create a new trigger
        }, this.getDateOffset(user.utc, user.hour));
    },

    // Removes the trigger associated with a user
    unset: function(user) {
        clearTimeout(this.triggers[user.id]);
        this.triggers[user.id] = null;
    },

    /*
     * Dates
     */

    // Returns the offset (in ms) from the current date to the next friday (with the user timezone and hour applied)
    getDateOffset: function(utc, hour) {
        var currentDate = new Date(),
            nextDate = new Date();

        nextDate.setHours(currentDate.getTimezoneOffset() / 60 + utc + hour, 0, 0, 0); // Applies the user hour with the UTC calculations

        // These conditions sets "nextDate" to the next friday
        if(currentDate.getDay() == 5 && nextDate.getTime() < currentDate.getTime()) {
            nextDate.setDate(currentDate.getDate() + 7);
        } else if(currentDate.getDay() == 6) {
            nextDate.setDate(currentDate.getDate() + 6);
        } else {
            nextDate.setDate(currentDate.getDate() + 5 - currentDate.getDay());
        }

        return nextDate.getTime() - currentDate.getTime() + 500; // +500ms to avoid looping
    }

};
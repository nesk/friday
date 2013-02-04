/*
    The Trigger module manages the date calculations needed to know
    when we should tweet for a user.
*/

module.exports = {

    /*
     * Attributes
     */

    manager: null,
    twitter: null,
    triggers: {},

    /*
     * Initialization
     */

    init: function(users, manager, twitter) {
        this.manager = manager;
        this.twitter = twitter;

        // All the triggers are set with this loop
        for(var id in users) {
            this.set(users[id]);
        }
    },

    /*
     * Triggers : management
     */

    set: function(user) {
        var _this = this;

        // Clearing the timer if there's already one
        clearTimeout(this.triggers[user.id]);

        this.triggers[user.id] = setTimeout(function() {
            // Tell twitter that we need to tweet for the current user

            _this.set(user); // We can create a new trigger
        }, this.getDateOffset(user.utc, user.hour));
    },

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
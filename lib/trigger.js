module.exports = {

    /*
     * Attributes
     */

    manager: null,
    triggers: {},

    /*
     * Initialization
     */

    init: function(users, manager) {
        this.manager = manager;

        // All the triggers are set with this loop
        for(var id in users) {
            this.set(id, users[id]);
        }
    },

    /*
     * Triggers : management
     */

    set: function(id, user) {
        var _this = this;

        // Clearing the timer if there's already one
        this.triggers[id] && clearTimeout(this.triggers[id].timeoutId);

        setTimeout(function() {
            // Tell twitter that we need to tweet for the current user

            _this.set(id, user);
        }, this.getDateOffset(user.utc, user.hour));
    },

    unset: function(id) {
        clearTimeout(this.triggers[id].timeoutId);
        this.triggers[id] = null;
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
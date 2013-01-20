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
     * Dates
     */

    // Returns the offset (in ms) from the current date to the next friday (with the user timezone and hour applied)
    getDateOffset: function(utc, hour) {
        var currentDate = new Date(),
            nextDate = new Date();

        nextDate.setDate(currentDate.getDate() + 5 - currentDate.getDay()); // Sets "nextDate" to the next friday
        nextDate.setHours(currentDate.getTimezoneOffset() / 60 + utc + hour, 0, 0, 0); // Applies the user hour with the UTC calculations

        return nextDate.getTime() - currentDate.getTime();
    }

};
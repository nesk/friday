(function() {
    
    /*
     * Animation
     */

    var day = new Date().getDay(),
        objects = document.getElementsByTagName('object'),
        index = +(day != 5);
    
    objects[index].style.display = 'block';

    /*
     * Flash messages
     */

    var msgList = document.getElementById('msg-list');

    var flashMsg = {

        applyTimeout: function(node) {
            setTimeout(function() {
                node.className += ' hide-msg';
                setTimeout(function() {
                    msgList.removeChild(node);
                }, 400);
            }, 5000);
        },

        add: function(text) {
            var node = document.createElement('div');
            node.className = 'msg';
            node.innerHTML = text;
            msgList.appendChild(node);
            this.applyTimeout(node);
        }

    };

    if(msgList.childNodes.length) {
        flashMsg.applyTimeout(msgList.childNodes[0]); // There can be only one message when the page is loading, a loop is unnecessary.
    }

    /*
     *  Settings
     */

    var settings = document.getElementById('settings');

    if(settings) {
        settings.onsubmit = function(event) {
            event.preventDefault();

            var gmt = document.getElementsByName('gmt')[0];
            gmt = encodeURIComponent(gmt.options[gmt.selectedIndex].value);

            var hour = document.getElementsByName('hour')[0];
            hour = encodeURIComponent(hour.options[hour.selectedIndex].value);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/settings');

            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function() {
                if(xhr.readyState == xhr.DONE) {
                    var res = JSON.parse(xhr.responseText);

                    if(!res.error) {
                        flashMsg.add(res.msg);
                    } else {
                        location = '/';
                    }
                }
            };

            xhr.send('gmt=' + gmt + '&hour=' + hour);
        };
    }

})();
exports.index = function(req, res) {
    var flashMsg = req.session.flashMsg;
    req.session.flashMsg = null; // The flash message will be displayed, we can erase it.

    res.render('index', {
        authenticated: !!req.session.id,
        flashMsg: flashMsg
    });
};

// If this callback is executed it's because we encountered an error with the OAuth API
exports.auth = function(req, res) {
    req.session.flashMsg = "We encountered an internal error, you should retry in a few minutes.";
    res.redirect('/');
};

exports.authCallback = function(req, res) {
    var sess = req.session;

    switch(res.locals.status) {
        case 0:
            sess.flashMsg = "You have been successfully authenticated, you can now start to edit your settings.";
        break;
        case 1:
            sess.flashMsg = "<strong>It's Friday</strong> can't access to your Twitter account, maybe you should retry?";
        break;
        case 2:
            sess.flashMsg = "You don't have access to this webpage!";
    }

    res.redirect('/'); // Redirecting to the index page, the flash message will be displayed on it.
};

exports.settings = function(req, res) {
    switch(res.locals.status) {
        case 0:
            res.send(JSON.stringify({
                msg: "Your settings have been updated."
            }));
        break;
        case 1:
            res.send(JSON.stringify({
                msg: "Make sure to specify correctly your time zone and the hour and try again."
            }));
        break;
        case 2:
            req.session.flashMsg = "You're not authenticated, please sign in with Twitter below and try again.";
            res.send(JSON.stringify({
                error: true
            }));
    }
};
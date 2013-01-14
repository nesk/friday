exports.index = function(req, res) {
    res.render('index', {
        authenticated: !!req.session.id,
    });
};

exports.auth = function(req, res) {
    
};

exports.authCallback = function(req, res) {
    switch(res.locals.status) {
        case 0: res.send('OK');
        break;
        case 1: res.send('No access to the user');
        break;
        case 2: res.send('Forbidden');
    }
};

exports.settings = function(req, res) {
    res.render('settings');
};
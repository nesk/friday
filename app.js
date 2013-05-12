var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express(),
    config = require(path.join(__dirname, 'config.json')), // Loads the app configuration
    Manager = require(path.join(__dirname, 'lib/manager')).init(config); // Initiates the Manager with the app configuration

var mainControllers = require(path.join(__dirname, 'controllers')),
    managControllers = Manager.controllers,
    authControllers = Manager.submodules.auth.controllers;

app.configure(function(){
    app.set('port', config.server.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret:config.application.cookie_secret }));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', mainControllers.index);
app.get('/auth', authControllers.auth, mainControllers.auth);
app.get('/auth/callback', authControllers.callback, mainControllers.authCallback);
app.post('/settings', managControllers.settings, mainControllers.settings);
app.get('/hash/:hash', mainControllers.hash); // The hash isn't used anymore, it's just here for backward compatibility with the old tweets.

app.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
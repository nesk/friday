var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    yaml = require('yamljs');

var app = express(),
    config = yaml.load('config.yml'), // Loads the app configuration
    Manager = require(path.join(__dirname, 'lib/manager')).init(config); // Initiates the Manager with the app configuration

app.configure(function(){
    app.set('port', 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/settings', routes.settings);

app.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

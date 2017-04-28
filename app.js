var models = require('./models');
var express = require('express');
var app = express();
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var bodyParser = require('body-parser');

// templating boilerplate setup
app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', { noCache: true });

// logging middleware
app.use(morgan);

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


models.User.sync()
    .then(function() {
        return models.Page.sync()
    })
    .then(function() {
        app.listen(3000, function() {
            console.log('Server is listening on port 3001!');
        });
    })
    .catch(console.error);
var models = require('./models');
var express = require('express');
var app = express();
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var bodyParser = require('body-parser');
var routes = require('./routes')
var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);

// templating boilerplate setup
app.engine('html', nunjucks.render);
app.set('view engine', 'html');
var env = nunjucks.configure('views', { noCache: true });
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

// logging middleware
app.use(morgan("combined"));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


models.User.sync()
    .then(function() {
        return models.Page.sync()
    })
    .then(function() {
        app.listen(3001, function() {
            console.log('Server is listening on port 3001!');
        });
    })
    .catch(console.error);

app.use("/", routes)

module.exports = app;
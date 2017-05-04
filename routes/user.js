var express = require('express')
var router = express.Router()
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get("/", function(req, res) {
    User.findAll().then(function(users) {
        res.render("users", {
            users: users
        })
    })
});

router.get("/:id", function(req, res) {
    Promise.all([
            User.findOne({
                where: {
                    id: req.params.id
                }
            }),
            Page.findAll({
                where: {
                    authorId: req.params.id
                }
            })
        ])
        .then(function(results) {
            console.log(results[1]);
            res.render("userpage", {
                name: results[0].dataValues.name,
                email: results[0].dataValues.email,
                pages: results[1]
            })
        })
});


module.exports = router;
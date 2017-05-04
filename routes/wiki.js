var express = require('express')
var router = express.Router()
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get("/", function(req, res) {
    res.redirect("/", 200)
})

router.post("/", function(req, res, next) {
    User.findOrCreate({
            where: {
                name: req.body.authorName,
                email: req.body.authorContact
            }
        }).then(
            function(instance) {
                var user = instance[0];

                var page = Page.build({
                    title: req.body.title,
                    content: req.body.pageBody,
                    status: req.body.pageStatus,
                    tags: req.body.tags.toLowerCase().split(" ")
                })
                return page.save()
                    .then(function(page) {
                        return page.setAuthor(user)
                    })
            })
        .then(function(page) {
            res.redirect(page.route)
        })
        .catch(next)
})

router.get("/add", function(req, res) {
    res.render("addpage")
})

router.get("/search", function(req, res) {
    Page.findByTag(req.query.tags).then(function(results) {
        res.render("index", {
            pages: results,
            showForm: true
        })
    });
})

router.get("/:urlTitle/similar", function(req, res, next) {
    var title = req.params.urlTitle;
    Page.findOne({
            where: {
                title: title
            },
            include: [
                { model: User, as: 'author' }
            ]
        })
        .then(function(results) {
            if (results === null) {
                res.status(404).send("Page not found.")
            }
            return results.findSimilar()
        })
        .then(function(results) {
            res.render("index", {
                pages: results
            })
        })
        .catch(next)
})

router.get("/:urlTitle", function(req, res, next) {
    var title = req.params.urlTitle;
    Page.findOne({
            where: {
                urlTitle: title
            },
            include: [
                { model: User, as: 'author' }
            ]
        })
        .then(function(page) {
            if (page === null) {
                res.status(404).send("Page not found.")
            }
            res.render('wikipage', {
                page: page,
                userLink: "/users/" + page.dataValues.authorId,
                similar: page.dataValues.title + "/similar"
            });
        }).catch(next)
})



module.exports = router;
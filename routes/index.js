var express = require('express')
var router = express.Router()
var models = require("../models")
const wikiRouter = require('./wiki');
const userRouter = require('./user');
var Page = models.Page;


router.use("/wiki", wikiRouter);
router.use("/users", userRouter)

router.get("/", function(req, res) {
    Page.findAll().then(function(pages) {
        res.render("index", {
            pages: pages,
            showForm: false
        })
    })
});

router.get("/about", function(req, res) {
    res.send("This is all about me~!")
})


router.get("/search", function(req, res) {
    res.render("tagsearch")
})
module.exports = router;
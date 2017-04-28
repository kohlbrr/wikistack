var express = require('express')
var router = express.Router()

router.get("/", function(req, res) {
    res.render("index")
});

router.get("/wiki/", function(req, res) {
    res.render("wikipage")
});

module.exports = router;
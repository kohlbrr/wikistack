var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var models = require("../models");
var chai = require('chai');
var expect = chai.expect;
var Page = models.Page;
var User = models.User;

describe('http requests', function() {

    describe('GET /wiki/', function() {
        it('responds with 200 on index', function(done) {
            agent
                .get('/wiki')
                .expect(200, done);
        });
    });

    describe('GET /wiki/add', function() {
        it('responds with 200', function(done) {
            agent
                .get('/wiki/add')
                .expect(200, done);
        });
    });

    describe('GET /wiki/:urlTitle', function() {
        before(function(done) {
            var page = Page.build({
                title: "thetest",
                content: "we're testin",
                status: "open",
                tags: ["think"]
            })

            page.save()
                .then(function() {
                    done();
                })
        })
        it('responds with 404 on page that does not exist', function(done) {
            agent
                .get('/wiki/hahathiswillnevebeatitleEVER')
                .expect(404, done);
        });
        it('responds with 200 on page that does exist', function(done) {
            agent
                .get('/wiki/thetest')
                .expect(200, done);
        });
    });

    describe('GET /wiki/search/:tag', function() {
        before(function(done) {
            var page = Page.build({
                title: "thetest",
                content: "we're testin",
                status: "open",
                tags: ["think"]
            })

            page.save()
                .then(function() {
                    done();
                })
        })
        it('responds with 200', function(done) {
            agent
                .get('/wiki/search/?tags=testem')
                .expect(200, done);
        });

        describe('GET /wiki/:urlTitle/similar', function() {
            it('responds with 404 for page that does not exist', function(done) {
                agent
                    .get("/wiki/12409u1240218401284124/similar")
                    .expect(404, done)
            });
            it('responds with 200 for similar page', function(done) {
                agent
                    .get('/wiki/thetest/similar')
                    .expect(200, done);
            });
        });

        describe('POST /wiki', function() {
            it('responds with 302', function() {

                return agent
                    .post('/wiki/')
                    .send({
                        authorName: "sam",
                        authorContact: "email",
                        title: "thepost",
                        pageBody: "we're testin",
                        pageStatus: "open",
                        tags: "hope it works"
                    })
                    .expect(302)

            });
            it('creates a page in the database', function() {
                return Page.findOne({
                    where: {
                        title: "thepost",
                        content: "we're testin",
                        status: "open"
                    }
                }).then(function(results) {
                    expect(results).to.exist;
                })
            });
        });

    });
});
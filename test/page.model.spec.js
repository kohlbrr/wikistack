var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies')
chai.use(spies);
var marked = require('marked');
var models = require("../models")
var Page = models.Page;
var User = models.User;
var page;



describe('Page', function() {
    before(function() {
        return User.sync({ force: true })
            .then(function() {
                return Page.sync({ force: true })
            })
    })
    beforeEach(function() {
        return Page.truncate();
    })
    describe('virtuals', function() {
        beforeEach(function() {
            page = Page.build()
        })
        describe('route', function() {
            it('maps uri to url', function() {
                page.urlTitle = "test";
                expect(page.route).to.equal("/wiki/test")
            });
        });
        describe('renderedContent', function() {
            it('renders raw text into markdown code', function() {
                page.content = "test";
                expect(page.renderedContent).to.equal(marked(page.content))
            });
        });
    });
    describe('class methods', function() {
        before(function(done) {
            var page = Page.findOrCreate({
                    where: {
                        title: 'dooooo',
                        content: 'bar',
                        tags: ['doo', 'tar']
                    }
                })
                .then(function(results) {
                    console.log(page)
                    done()
                })
                .catch(done);
        })
        describe('findByTag', function() {
            it('grabs properly', function(done) {
                Page.findByTag('doo')
                    .then(function(results) {
                        expect(results).to.have.length.of(1)
                        done()
                    }).catch(done)
            });
            it('does not grab everything', function(done) {
                Page.findByTag('falafel')
                    .then(function(results) {
                        expect(results).to.have.length.of(0)
                        done()
                    }).catch(done)
            });
        });
    });
    describe('instance methods', function() {
        var test, test2, test3;
        before(function(done) {
            Promise.all([
                    Page.findOrCreate({
                        where: {
                            title: 'foo',
                            content: 'bar',
                            tags: ['foo', 'bar']
                        }
                    }),
                    Page.findOrCreate({
                        where: {
                            title: 'doo',
                            content: 'sar',
                            tags: ['foo', 'tar']
                        }
                    }),
                    Page.findOrCreate({
                        where: {
                            title: 'boo',
                            content: 'mar',
                            tags: ['moo', 'jar']
                        }
                    })
                ])
                .then(function(results) {
                    console.log(results)
                    test = results[0][0]
                    test2 = results[1][0]
                    test3 = results[2][0]
                    done()
                });
        });

        describe('findSimilar', function() {
            it('grabs proper amount of tests', function(done) {
                test.findSimilar()
                    .then(function(results) {
                        expect(results).to.have.length.of(1)
                        done()
                    }).catch(done)
            });
            it('never gets itself', function(done) {
                test.findSimilar()
                    .then(function(results) {
                        expect(results).to.not.include(test)
                        done()
                    }).catch(done)
            });
            it('gets other pages with common tags',
                function(done) {
                    test.findSimilar()
                        .then(function(results) {
                            expect(results).to.include(test2)
                            done()
                        }).catch(done)
                });
            it('does not get other pages with no common tags',
                function(done) {
                    test.findSimilar()
                        .then(function(results) {
                            expect(results).to.not.include(test3)
                            done()
                        }).catch(done)
                });
        });
    });
    describe('validation', function() {
        beforeEach(function() {
            page = Page.build()
        })
        it('errors without title', function() {
            page.content = "I'm here";
            page.status = "open";

            return page.validate().
            then(function(results) {
                expect(results.message).to.include("notNull Violation: title cannot be null")
            });
        });
        it('errors without content', function() {
            page.title = "The title";
            page.urlTitle = "The_title"

            return page.validate().
            then(function(results) {
                expect(results.message).to.include("notNull Violation: content cannot be null")
            });
        });

        it('errors given an invalid status', function() {
            page.title = "The title";
            page.urlTitle = "The_title"
            page.content = "I'm here";
            page.status = "I am a very silly status"

            expect(page.save).to.throw(TypeError);
        });

    });
    describe('hook', function() {
        before(function() {
            page = Page.build({
                title: 'not good wiki title',
                content: 'bar',
                tags: ['zippity', 'zoo', 'da']
            })
            return page.save()
                .then(function(results) {
                    page = results;
                })
        });
        it('properly transforms page title to uri', function() {
            expect(page.urlTitle).to.equal("not_good_wiki_title")
        });
    });
});
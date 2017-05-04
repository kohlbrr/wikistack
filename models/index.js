var Sequelize = require('sequelize');
var marked = require('marked');
var db = new Sequelize('postgres://localhost:5432/wikistack');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    },
}, {
    getterMethods: {
        route: function() {
            return "/wiki/" + this.urlTitle
        },
        renderedContent: function() {

            return marked(this.content)
        }
    },
    classMethods: {
        findByTag: function(tag) {
            return this.findAll({
                // $overlap matches a set of possibilities
                where: {
                    tags: {
                        $overlap: [tag, tag]
                    }
                }
            })
        }
    },
    instanceMethods: {
        findSimilar: function() {
            return Page.findAll({
                // $overlap matches a set of possibilities
                where: {
                    title: { $ne: this.title },
                    tags: {
                        $overlap: this.tags,
                    }
                }
            })
        }
    }
});

Page.hook('beforeValidate', function(page) {
    if (page.title) {
        page.urlTitle = page.title.replace(/\s/g, '_').replace(/\W/g, '');
    } else {
        page.urlTitle = Math.random().toString(36).substring(2, 7);
    }
});


var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Page.belongsTo(User, { as: 'author' });


module.exports = {
    Page: Page,
    User: User
};
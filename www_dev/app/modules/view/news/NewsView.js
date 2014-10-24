define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var ArticleDetailView = require("modules/view/news/ArticleDetailView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");

    /**
     * 記事一覧・詳細のメインとなる画面のViewクラス
     */
    var NewsView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/news"),
        model : new ArticleModel(),
        collection : new ArticleCollection(),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {
            this.collection = new ArticleCollection();

            var articleListView = new ArticleListView();
            articleListView.collection = this.collection;
            this.setView(".article-list", articleListView);

            articleListView.listenTo(this.collection, "reset sync request", articleListView.render);
            
            this.collection.fetch();

        },

        events : {
            "click .articleListItem" : "onClickArticleListItem"
        },
        onClickArticleListItem : function(ev) {
            var articleId = $(ev.currentTarget).attr("data-article-id");
            var article = this.collection.find(function(item) {
                return item.get('__id') === articleId;
            });
            this.setArticle(article);
        },
        setArticle : function(article) {
            this.setView(".article-detail", new ArticleDetailView({
                model: article
            })).render();
        }

    });

    module.exports = NewsView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var FeedListView = require("modules/view/news/FeedListView");
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

            // FeedListView初期化
            var feedListView = new FeedListView();
            feedListView.collection = this.collection;
            this.setView("#sidebar__list", feedListView);
            feedListView.listenTo(this.collection, "reset sync request", feedListView.render);
            
            // ArticleListView初期化
            var articleListView = new ArticleListView();
            articleListView.collection = this.collection;
            this.setView("#article-list", articleListView);
            articleListView.listenTo(this.collection, "reset sync request", articleListView.render);
            
            // 一番最初の記事を描画
            var self = this;
            this.collection.fetch({
                success: function() {
                    var article = self.collection.at(0);
                    self.setArticle(article);
                }
            });
        },

        events : {
            "click .articleListItem" : "onClickArticleListItem"
        },
        
        /**
         *  サイドメニューから記事をクリックしたら呼ばれる
         *  
         *  @param {Event} ev
         */
        onClickArticleListItem : function(ev) {
            var articleId = $(ev.currentTarget).attr("data-article-id");
            var article = this.collection.find(function(item) {
                return item.get('__id') === articleId;
            });
            this.setArticle(article);
        },
        
        /**
         *  記事を指定して表示する
         *  
         *  @param {Backbone.Model} article
         */
        setArticle : function(article) {
            // [TODO] article listの中から該当の記事まで移動する
            /*
            this.setView("#article-list", new ArticleDetailView({
                model: article
            })).render();
            */
        }

    });

    module.exports = NewsView;
});

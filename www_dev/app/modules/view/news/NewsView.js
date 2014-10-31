define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var FeedListView = require("modules/view/news/FeedListView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var FavoriteCollection = require("modules/collection/article/FavoriteCollection");

    /**
     * 記事一覧・詳細のメインとなる画面のViewクラス
     */
    var NewsView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/news"),
        model : new ArticleModel(),
        collection : new ArticleCollection(),
        favoriteCollection : new FavoriteCollection(),

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
            
            this.collection.fetch({success: $.proxy(this.onfetchArticle,this)});

        },
        /**
         * 記事情報検索完了後のコールバック関数
         */
        onfetchArticle: function () {
//            this.favoriteCollection.condition.filter = "";
            this.favoriteCollection.fetch({success: $.proxy(this.onfetchFavorite,this)});
        },
        /**
         * お気に入り情報検索完了後のコールバック関数
         */
        onfetchFavorite: function () {
            this.collection.each($.proxy(function (article) {
                this.favoriteCollection.each($.proxy(function (favorite) {
                    if (article.get("url") === favorite.get("source")) {
                        article.set("isFavorite",true);
                    }
                },this));
            },this));
            
            var article = this.collection.at(0);
            this.setArticle(article);
        },

        events : {
            "click .articleListItem" : "onClickArticleListItem"
        },
        
        /**
         * 記事リストアイテムをクリックされたときのコールバック関数
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
         * 記事詳細に記事情報を表示する
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

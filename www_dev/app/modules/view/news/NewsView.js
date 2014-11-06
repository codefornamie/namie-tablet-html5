define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var FeedListView = require("modules/view/news/FeedListView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var FavoriteCollection = require("modules/collection/article/FavoriteCollection");
    var YouTubeCollection = require("modules/collection/youtube/YouTubeCollection");
    var EventsCollection = require("modules/collection/events/EventsCollection");

    /**
     * 記事一覧・詳細のメインとなる画面のViewクラス
     */
    var NewsView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/news"),
        model : new ArticleModel(),
        fetchCounter : 0,
        articleCollection : new ArticleCollection(),
        favoriteCollection : new FavoriteCollection(),
        youtubeCollection : new YouTubeCollection(),
        eventsCollection : new EventsCollection(),
        newsCollection : {models:[]},

        beforeRendered : function() {

        },

        afterRendered : function() {
        },

        initialize : function() {
            this.requestGoogleAPIClient();
            this.articleCollection.fetch({success: $.proxy(this.onfetchArticle,this)});
            this.eventsCollection.fetch({success: $.proxy(this.onfetchEvents,this)});
        },
        /**
         * Google API clientを初期化する
         */
        requestGoogleAPIClient : function() {
            if (app.gapiLoaded) {
                this.searchYoutube();
                return;
            }

            var self = this;
            window.googleApiClientReady = function() {
                delete window.googleApiClientReady;

                window.onYouTubeIframeAPIReady = function() {
                    delete window.onYouTubeIframeAPIReady;
                    app.gapiLoaded = true;

                    self.searchYoutube();
                };

                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            };

            var tag = document.createElement('script');
            tag.src = "https://apis.google.com/js/client.js?onload=googleApiClientReady";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        },
        /**
         *  YouTube情報の検索
         *  GoogleAPIの初期化が済んだら呼ばれる
         */
        searchYoutube: function () {
            this.youtubeCollection.channelId = "UC9_ZCtgOk8dPC6boqZMNqbw";
            var onload = function () {
                this.youtubeCollection.fetch({
                    success : $.proxy(this.onFetchYoutube,this),
                    error : function error(model, response, options) {
                        console.log("error");
                    }
                });
            };
            gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
            gapi.client.load('youtube', 'v3', $.proxy(onload, this));
        },
        /**
         * youtube情報検索完了後のコールバック関数
         */
        onFetchYoutube: function () {
            this.fetchCounter++;
            if (this.fetchCounter >= 3) {
                this.onFetchAll();
            }
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
            this.articleCollection.each($.proxy(function (article) {
                this.favoriteCollection.each($.proxy(function (favorite) {
                    if (article.get("url") === favorite.get("source")) {
                        article.set("isFavorite",true);
                    }
                },this));
            },this));
            this.fetchCounter++;
            if (this.fetchCounter >= 3) {
                this.onFetchAll();
            }
        },
        /**
         * イベント情報検索完了後のコールバック関数
         */
        onfetchEvents: function () {
            this.fetchCounter++;
            if (this.fetchCounter >= 3) {
                this.onFetchAll();
            }
        },
        /**
         * youtube情報検索完了後のコールバック関数
         */
        onfetchYoutube: function () {
            this.fetchCounter++;
            if (this.fetchCounter >= 3) {
                this.onFetchAll();
            }
        },

        /**
         * 全ての情報検索完了後のコールバック関数
         */
        onFetchAll: function () {
            this.newsCollection = new Backbone.Collection();
            this.newsCollection.add(this.articleCollection.models);
            this.newsCollection.add(this.youtubeCollection.models);
            this.newsCollection.add(this.eventsCollection.models);

            // FeedListView初期化
            var feedListView = new FeedListView();
            feedListView.collection = this.newsCollection;
            this.setView("#sidebar__list", feedListView);
            feedListView.render();
            feedListView.listenTo(this.articleCollection, "reset sync request", feedListView.render);

            // ArticleListView初期化
            var articleListView = new ArticleListView();
            articleListView.collection = this.newsCollection;
            this.setView("#article-list", articleListView);
            articleListView.render();
            articleListView.listenTo(this.articleCollection, "reset sync request", articleListView.render);
        },

    });

    module.exports = NewsView;
});

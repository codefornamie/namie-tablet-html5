define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
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
        newsCollection : new Backbone.Collection(),

        beforeRendered : function() {
        },

        afterRendered : function() {
        },

        initialize : function() {
            async.parallel([
                this.loadYoutube.bind(this),
                this.loadArticle.bind(this),
                this.loadEvents.bind(this)
            ], this.onFetchAll.bind(this));
        },
        
        /**
         *  youtubeのコンテンツを読み込む
         *  @param {Function} callback
         */
        loadYoutube: function (callback) {
            async.series([
                this.requestGoogleAPIClient.bind(this),
                this.searchYoutube.bind(this)
            ], callback);
        },

        /**
         *  Google API clientを初期化する
         *  @param {Function} callback
         */
        requestGoogleAPIClient : function(callback) {
            if (app.gapiLoaded) {
                callback();
                return;
            }

            var self = this;
            
            var loadScript = function (url) {
                return function (next) {
                    $.getScript(url)
                        .done(function () {
                            next(null);
                        })
                        .fail(function (jqXHR, settings, err) {
                            next(err);
                        });
                };
            };

            async.series([
                loadScript("https://apis.google.com/js/client.js"),
                loadScript("https://www.youtube.com/iframe_api")
            ], function (err) {
                if (!err) {
                    app.gapiLoaded = true;
                }

                callback(err);
            });
        },

        /**
         *  YouTube情報の検索
         *  GoogleAPIの初期化が済んだら呼ばれる
         *  @param {Function} callback
         */
        searchYoutube: function (callback) {
            this.youtubeCollection.channelId = "UC9_ZCtgOk8dPC6boqZMNqbw";

            var onload = function () {
                this.youtubeCollection.fetch({
                    success: function () {
                        callback();
                    },
                    
                    error: function onErrorSearchYoutube() {
                        callback('error');
                    }
                });
            };

            gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
            gapi.client.load('youtube', 'v3', $.proxy(onload, this));
        },
        
        /**
         *  articleを読み込む
         *  @param {Function} callback
         */
        loadArticle: function (callback) {
            var self = this;

            this.articleCollection.fetch({
                success: function () {
                    self.loadFavorite(callback);
                },
                
                error: function onErrorLoadArticle() {
                    callback('err');
                }
            });
        },
        
        /**
         *  favoriteを読み込む
         *  @param {Function} callback
         */
        loadFavorite: function (callback) {
            var self = this;

            this.favoriteCollection.fetch({
                success: function () {
                    // articleCollectionにfav状態を反映する
                    self.articleCollection.each(function (article) {
                        self.favoriteCollection.each(function (favorite) {
                            if (article.get("url") === favorite.get("source")) {
                                article.set("isFavorite", true);
                            }
                        });
                    });

                    callback();
                },
                
                error: function onErrorLoadFavorite() {
                    callback('error');
                }
            });
        },
        
        /**
         *  eventsを読み込む
         *  @param {Function} callback
         */
        loadEvents: function (callback) {
            this.eventsCollection.fetch({
                success: function () {
                    callback();
                },
                
                error: function onErrorLoadEvents() {
                    callback('error');
                }
            });
        },

        /**
         *  全ての情報検索完了後のコールバック関数
         *  @param {Error|Undefined} err
         */
        onFetchAll: function (err) {
            if (err) {
                console.error(err);
                return;
            }

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

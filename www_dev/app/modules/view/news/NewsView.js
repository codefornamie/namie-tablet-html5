define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var FeedListView = require("modules/view/news/FeedListView");
    var RecommendArticleView = require("modules/view/news/RecommendArticleView");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var EventListItemView = require("modules/view/news/EventListItemView");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");

    var DateUtil = require("modules/util/DateUtil");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var RecommendCollection = require("modules/collection/article/RecommendCollection");
    var FavoriteCollection = require("modules/collection/article/FavoriteCollection");
    var EventsCollection = require("modules/collection/events/EventsCollection");
    var Equal = require("modules/util/filter/Equal");
    var IsNull = require("modules/util/filter/IsNull");
    var vexDialog = require("vexDialog");

    /**
     * 記事一覧・詳細のメインとなる画面のViewクラスを作成する。
     * @class 記事一覧・詳細のメインとなる画面のViewクラス
     * @exports NewsView
     * @constructor
     */
    var NewsView = AbstractView.extend({

        template : require("ldsh!templates/{mode}/news/news"),
        model : new ArticleModel(),
        fetchCounter : 0,
        articleCollection : new ArticleCollection(),
        recommendCollection : new RecommendCollection(),
        favoriteCollection : new FavoriteCollection(),
        eventsCollection : new EventsCollection(),
        newsCollection : new Backbone.Collection(),
        events : {
            "click [data-article-id]" : "onClickFeedItem"
        },
        beforeRendered : function() {
        },

        afterRendered : function() {
        },

        initialize : function() {
            this.setArticleSearchCondition({
                targetDate : new Date("2014/11/28")
            });
            this.searchArticles();
        },
        /**
         * 記事の検索処理を開始する。
         */
        searchArticles : function() {
            app.ga.trackPageView("/NewsView", "ニュース");

            this.showLoading();

            // 現在保持しているデータをクリア
            this.articleCollection.reset();
            this.recommendCollection.reset();
            this.eventsCollection.reset();

            async.parallel([
                    this.loadYouTubeLibrary.bind(this), this.loadArticle.bind(this), this.loadRecommend.bind(this),
                    this.loadEvents.bind(this)
            ], this.onFetchAll.bind(this));
        },
        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         */
        setArticleSearchCondition : function(condition) {
            var targetDate = condition.targetDate;
            var dateString = DateUtil.formatDate(targetDate, "yyyy-MM-dd");
            this.articleCollection.condition.filters = [
                    new Equal("publishedAt", dateString), new IsNull("isDepublish")
            ];
            this.recommendCollection.condition.filters = new Equal("publishedAt", dateString);
            this.eventsCollection.condition.filters = new Equal("publishedAt", dateString);
        },
        /**
         * youtubeライブラリを読み込む
         * @param {Function} callback
         */
        loadYouTubeLibrary : function(callback) {
            if (app.gapiLoaded) {
                callback();
                return;
            }
            var self = this;
            var loadScript = function(url) {
                return function(next) {
                    $.getScript(url).done(function() {
                        next(null);
                    }).fail(function(jqXHR, settings, err) {
                        next(err);
                    });
                };
            };
            var onLoadGAPI = function(next) {
                window.onLoadGAPI = function() {
                    delete window.onLoadGAPI;
                    next(null);
                };

                loadScript("https://apis.google.com/js/client.js?onload=onLoadGAPI")(function(err) {
                    if (err) {
                        next(err);
                        return;
                    }
                });
            };
            async.series([
                    onLoadGAPI, loadScript("https://www.youtube.com/iframe_api")
            ], function(err) {
                if (!err) {
                    app.gapiLoaded = true;
                }
                callback(err);
            });
        },

        /**
         * articleを読み込む
         * @param {Function} callback
         */
        loadArticle : function(callback) {
            var self = this;

            this.articleCollection.fetch({
                success : function() {
                    self.loadFavorite(callback);
                },

                error : function onErrorLoadArticle() {
                    callback('err');
                }
            });
        },

        /**
         * favoriteを読み込む
         * @param {Function} callback
         */
        loadFavorite : function(callback) {
            this.favoriteCollection.condition.filters = [
                new Equal("userId", app.user.get("__id"))
            ];

            this.favoriteCollection.fetch({
                success : function() {
                    callback();
                },

                error : function onErrorLoadFavorite() {
                    callback('error');
                }
            });
        },

        /**
         * eventsを読み込む
         * @param {Function} callback
         */
        loadEvents : function(callback) {
            this.eventsCollection.reset();
            this.eventsCollection.fetch({
                success : function() {
                    callback();
                },

                error : function onErrorLoadEvents() {
                    callback('error');
                }
            });
        },
        /**
         * Recommendを読み込む
         * @param {Function} callback
         */
        loadRecommend : function(callback) {
            this.recommendCollection.fetch({
                success : function() {
                    callback();
                },

                error : function() {
                    callback('error');
                }
            });
        },

        /**
         * 全ての情報検索完了後のコールバック関数
         * @param {Error|Undefined} err
         */
        onFetchAll : function(err) {
            if (err) {
                console.error(err);
                return;
            }

            // this.newsCollection.add(this.youtubeCollection.models);
            this.newsCollection.reset();
            this.newsCollection.add(this.articleCollection.models);
            this.newsCollection.add(this.eventsCollection.models);

            // articleCollectionに切抜き、おすすめ状態を反映する
            this.newsCollection.each($.proxy(function(article) {
                this.favoriteCollection.each(function(favorite) {
                    if (article.get("__id") === favorite.get("source")) {
                        article.set("isFavorite", !favorite.get("deletedAt"));
                        article.favorite = favorite;
                    }
                });

                // おすすめ数取得
                var recommends = this.recommendCollection.filter($.proxy(function(recommend) {
                    return article.get("__id") === recommend.get("source");
                }, this));
                article.recommendAmount = _.filter(recommends, function(recommend) {
                    return !recommend.get("deletedAt");
                }).length;

                // 自身のおすすめ情報を記事に付加
                _.each(recommends, $.proxy(function(recommend) {
                    if (recommend.get("isMine")) {
                        article.set("isRecommend", !recommend.get("deletedAt"));
                        article.recommend = recommend;
                    }
                }, this));

            }, this));

            // おすすめ記事を検索し、表示する
            var recommendArticle = this.newsCollection.find($.proxy(function(article) {
                return article.get("isRecommend") === "true";
            }, this));

            if (recommendArticle) {
                // おすすめ記事を表示する
                var articleView = new RecommendArticleView({
                    model : recommendArticle
                });
                this.setView("#recommendArticle", articleView).render();
            } else {
                this.$(".recommendArticleContainer").hide();
            }
            // FeedListView初期化
            this.showFeedListView();

            // ArticleListView初期化
            // this.showArticleListView();

            this.hideLoading();
        },
        /**
         * 左ペインの記事一覧メニューを表示する。
         */
        showFeedListView : function() {
            var feedListView = this.createFeedListView();
            feedListView.collection = this.newsCollection;

            this.removeView(this.feedListElement);
            this.setView(this.feedListElement, feedListView);
            feedListView.render();
            if (this.newsCollection.size() === 0) {
                this.showFeetNotFoundMessage();
            }
        },
        /**
         * 記事が見つからなかった場合のメッセージを画面に表示する。
         */
        showFeetNotFoundMessage : function() {
            $(this.el).find("#feedList").text("記事情報がありません");
        },
        /**
         * 記事一覧を表示する要素のセレクタ
         */
        feedListElement : '#sidebar__list',
        /**
         * 右ペインの記事一覧を表示するViewのインスタンスを作成して返す。
         * @return {FeedListView} 生成したFeedListViewのインスタンス
         */
        createFeedListView : function() {
            return new FeedListView();
        },
        /**
         * 右ペインの記事一覧を表示する。
         */
        showArticleListView : function() {
            var articleListView = new ArticleListView();
            articleListView.collection = this.newsCollection;
            this.removeView("#article-list");
            this.setView("#article-list", articleListView);
            articleListView.render();
        },
        /**
         * 指定されたarticleIdの記事までスクロール
         * 
         * @param {jQuery.Event} ev
         * @param {Object} param
         */
        onClickFeedItem : function(ev, param) {
            var articleId = $(ev.currentTarget).attr("data-article-id");
            // var articleModel = this.articleCollection.find(function(model) {
            // return model.get("__id") === articleId;
            // });
            // if (articleModel) {
            // this.showArticle(articleModel);
            // }
            app.newsView = this;
            app.router.go("article", articleId);
        },
        /**
         * 指定された記事IDの記事を表示する。
         * @param articleId {String} 記事ID
         */
        showArticle : function(articleId) {
            var model = this.articleCollection.find(function(article) {
                return article.get("__id") === articleId;
            });
            if (!model) {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("指定された記事は存在しません。");
                return ;
            }
            var template = require("ldsh!templates/{mode}/news/articleListItem");
            // 記事一覧に追加するViewクラス。
            // 以下の分岐処理で、対象のデータを表示するViewのクラスが設定される。
            var ListItemView;

            switch (model.get("type")) {
            case "1": // RSS
                template = require("ldsh!templates/{mode}/news/articleListItem");
                ListItemView = ArticleListItemView;
                if (model.get("rawHTML")) {
                    template = require("ldsh!templates/{mode}/news/articleListItemForHtml");
                }
                break;
            case "2": // YouTube
                template = require("ldsh!templates/{mode}/news/youTubeListItem");
                ListItemView = YouTubeListItemView;
                break;
            default:
                template = require("ldsh!templates/{mode}/news/eventsDetail");
                ListItemView = EventListItemView;
                break;
            }

            this.insertView("#article-list", new ListItemView({
                model : model,
                template : template
            })).render();
            $("#contents__secondary").hide();
            $("#contents__primary").show();
        }
    });

    module.exports = NewsView;
});

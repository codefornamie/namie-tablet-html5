define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");

    // view
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var GridListView = require("modules/view/news/GridListView");
    var RecommendArticleView = require("modules/view/news/RecommendArticleView");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var EventListItemView = require("modules/view/news/EventListItemView");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");

    // models
    var ArticleModel = require("modules/model/article/ArticleModel");

    // collections
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var RecommendCollection = require("modules/collection/article/RecommendCollection");
    var FavoriteCollection = require("modules/collection/article/FavoriteCollection");
    var EventsCollection = require("modules/collection/events/EventsCollection");

    // util
    var DateUtil = require("modules/util/DateUtil");
    var BusinessUtil = require("modules/util/BusinessUtil");
    var vexDialog = require("vexDialog");
    var IsNull = require("modules/util/filter/IsNull");
    var Equal = require("modules/util/filter/Equal");
    var And = require("modules/util/filter/And");
    var Or = require("modules/util/filter/Or");
    var Le = require("modules/util/filter/Le");
    var Ge = require("modules/util/filter/Ge");

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
            "click [data-article-id]" : "onClickGridItem"
        },
        beforeRendered : function() {
        },

        afterRendered : function() {
        },

        initialize : function(options) {
            options = options || {};

            this.targetDate = this.targetDate || options.date ||
                    DateUtil.formatDate(BusinessUtil.getCurrentPublishDate(), "yyyy-MM-dd");

            this.setArticleSearchCondition({
                targetDate : new Date(this.targetDate)
            });
            this.searchArticles();
            this.initEvents();
        },

        /**
         * イベントを初期化する
         * @memberof NewsView#
         */
        initEvents : function() {
            app.router.on("route", this.onRoute.bind(this));
        },

        /**
         * 記事の検索処理を開始する。
         * @memberof NewsView#
         */
        searchArticles : function() {
            this.trackPageView();

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
         * @memberof NewsView#
         */
        setArticleSearchCondition : function(condition) {
            var targetDate = condition.targetDate;
            var dateString = DateUtil.formatDate(targetDate, "yyyy-MM-dd");
            this.articleCollection.condition.filters = [
                    new Or([
                            new Equal("publishedAt", dateString), new And([
                                    new Le("publishedAt", dateString), new Ge("depublishedAt", dateString)
                            ])
                    ]), new IsNull("isDepublish")
            ];

            this.recommendCollection.condition.filters = [
                new Or([
                        new Equal("publishedAt", dateString), new And([
                                new Le("publishedAt", dateString), new Ge("depublishedAt", dateString)
                        ])
                ])
            ];

            this.eventsCollection.condition.filters = new Equal("publishedAt", dateString);
        },
        /**
         * youtubeライブラリを読み込む
         * @param {Function} callback
         * @memberof NewsView#
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
         * @memberof NewsView#
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
         * @memberof NewsView#
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
         * @memberof NewsView#
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
         * @memberof NewsView#
         */
        onFetchAll : function(err) {
            if (err) {
                console.error(err);
                return;
            }

            $(".contents__primary").scrollTop(0);

            // this.newsCollection.add(this.youtubeCollection.models);
            this.newsCollection.reset();
            this.newsCollection.add(this.articleCollection.models);
            this.newsCollection.add(this.eventsCollection.models);

            // articleCollectionに切抜き、おすすめ状態を反映する
            this.newsCollection.each($.proxy(function(article) {
                if (article.get("title", "おすすめイベント")) {
                    console.log("aaa");
                }
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
                        article.set("isMyRecommend", !recommend.get("deletedAt"));
                        article.recommend = recommend;
                    }
                }, this));

            }, this));

            // おすすめ記事を検索し、表示する
            var recommendArticle = this.newsCollection.find($.proxy(function(article) {
                return article.get("isRecommend") === "true" && article.get("publishedAt") === this.targetDate;
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
            // GridListView初期化
            this.showGridListView();

            // ArticleListView初期化
            this.showArticleListView();

            this.hideLoading();
        },
        /**
         * 記事一覧Viewを表示する要素のセレクタ
         * @memberof NewsView#
         */
        feedListElement: "#contents__top",
        /**
         * 左ペインの記事一覧メニューを表示する。
         * @memberof NewsView#
         */
        showGridListView : function() {
            var gridListView = this.createGridListView();
            gridListView.collection = this.newsCollection;

            this.removeView(this.gridListElement);
            
            this.setView(this.feedListElement, gridListView);
            gridListView.render();

            if (this.newsCollection.size() === 0) {
                this.showFeetNotFoundMessage();
            }
        },

        /**
         * 記事が見つからなかった場合のメッセージを画面に表示する。
         * @memberof NewsView#
         */
        showFeetNotFoundMessage : function() {
            this.$el.text("記事情報がありません");
        },

        /**
         * 右ペインの記事一覧を表示するViewのインスタンスを作成して返す。
         * @return {GridListView} 生成したGridListViewのインスタンス
         * @memberof NewsView#
         */
        createGridListView : function() {
            return new GridListView();
        },

        /**
         * 右ペインの記事一覧を表示する。
         * @memberof NewsView#
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
         * @memberof NewsView#
         */
        onClickGridItem : function(ev, param) {
            var articleId = $(ev.currentTarget).attr("data-article-id");
            app.newsView = this;
            app.router.go("article", articleId);
        },

        /**
         * 指定された記事IDの記事を表示する。
         * @param articleId {String} 記事ID
         * @memberof NewsView#
         */
        showArticle : function(articleId) {
            var model = this.articleCollection.find(function(article) {
                return article.get("__id") === articleId;
            });
            if (!model) {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("指定された記事は存在しません。");
                return;
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

            this.insertView(NewsView.SELECTOR_ARTICLE_DESTINATION, new ListItemView({
                model : model,
                template : template
            })).render();
            $("#contents__secondary").hide();
            $("#contents__primary").show();
        },

        /**
         * 記事詳細ページ以外では、記事詳細の要素を隠す
         * @memberof NewsView#
         */
        onRoute : function(route) {
            if (route === "showArticle") {
                $(NewsView.SELECTOR_ARTICLE_DESTINATION).show();
            } else {
                $(NewsView.SELECTOR_ARTICLE_DESTINATION).hide();
            }
        },

        /**
         * Google Analyticsでページビューを記録する
         */
        trackPageView : function() {
            app.ga.trackPageView("/NewsView", "ニュース");
        }
    }, {
        /**
         * 記事詳細を挿入する先のセレクタ
         * @memberof NewsView#
         */
        SELECTOR_ARTICLE_DESTINATION : "[data-news-detail]"
    });

    module.exports = NewsView;
});

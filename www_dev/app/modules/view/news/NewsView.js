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
    var Code = require("modules/util/Code");
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

        /**
         * 初期化処理
         * @memberOf NewsView#
         */
        initialize : function(options) {
            options = options || {};

            this.targetDate = this.targetDate || options.date;
            this.initialScrollTop = options.scrollTop || 0;

            this.setArticleSearchCondition({
                targetDate : new Date(this.targetDate)
            });

            this.searchArticles();
            this.initEvents();
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberOf NewsView#
         */
        setArticleSearchCondition : function(condition) {
            this.articleCollection.setSearchCondition(condition);
            this.recommendCollection.setSearchCondition(condition);
            this.eventsCollection.setSearchCondition(condition);
        },

        /**
         * イベントを初期化する
         * @memberOf NewsView#
         */
        initEvents : function() {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * 記事の検索処理を開始する。
         * @memberOf NewsView#
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
         * youtubeライブラリを読み込む
         * @param {Function} callback
         * @memberOf NewsView#
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
         * @memberOf NewsView#
         */
        loadArticle : function(callback) {
            var self = this;

            this.articleCollection.fetch({
                cache : true,

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
         * @memberOf NewsView#
         */
        loadFavorite : function(callback) {
            this.favoriteCollection.condition.filters = [
                new Equal("userId", app.user.get("__id"))
            ];

            this.favoriteCollection.fetch({
                cache : true,

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
         * @memberOf NewsView#
         */
        loadEvents : function(callback) {
            this.eventsCollection.reset();
            this.eventsCollection.fetch({
                cache : true,

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
         * @memberOf NewsView#
         */
        loadRecommend : function(callback) {
            this.recommendCollection.fetch({
                cache : true,

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
         * @memberOf NewsView#
         */
        onFetchAll : function(err) {
            var targetDate = new Date(this.targetDate);

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

            // 新聞アプリの場合、おたより全件を1件の表示するための処理を行う
            if (app.config.basic.mode === Code.APP_MODE_NEWS) {
                var anyLetter = this.newsCollection.find(function(article) {
                    return article.get("type") === "6";
                });
                if (anyLetter) {
                    // おたより記事が存在する場合の処理
                    var newsArticles = this.newsCollection.toArray();
                    var letterArticles = [];
                    var letterFolderArticle;
    
                    // newsCollectionからおたより記事を削除し、配列に追加する
                    _.each(newsArticles, $.proxy(function(article) {
                        if (article.get("type") === "6") {
                            this.newsCollection.remove(article);
                            letterArticles.push(article);
                        }
                    }, this));
    
                    // おたより画面を開くための記事を作成し、コレクションの先頭に登録
                    letterFolderArticle = new ArticleModel({
                        __id: "letter-" + DateUtil.formatDate(targetDate, "yyyy-MM-dd"),
                        dispSite: "おたより",
                        dispTitle: (targetDate.getMonth() + 1) + "月" + targetDate.getDate() + "日のおたより",
                        type: "6",
                        letters: letterArticles
                    });
                    this.newsCollection.unshift(letterFolderArticle);
                    this.articleCollection.unshift(letterFolderArticle);
                }
            }

            // GridListView初期化
            this.showGridListView();

            // ArticleListView初期化
            this.showArticleListView();

            this.hideLoading();
        },
        /**
         * 記事一覧Viewを表示する要素のセレクタ
         * @memberOf NewsView#
         */
        feedListElement : "#contents__top",
        /**
         * 左ペインの記事一覧メニューを表示する。
         * @memberOf NewsView#
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
         * @memberOf NewsView#
         */
        showFeetNotFoundMessage : function() {
            this.$el.text("記事情報がありません");
        },

        /**
         * 右ペインの記事一覧を表示するViewのインスタンスを作成して返す。
         * @return {GridListView} 生成したGridListViewのインスタンス
         * @memberOf NewsView#
         */
        createGridListView : function() {
            return new GridListView();
        },

        /**
         * 右ペインの記事一覧を表示する。
         * @memberOf NewsView#
         */
        showArticleListView : function() {
            var articleListView = new ArticleListView();
            articleListView.collection = this.newsCollection;
            this.removeView("#article-list");
            this.setView("#article-list", articleListView);
            articleListView.render();

            // 初期スクロール位置が指定されている場合、スクロールする
            this.initScrollTop();
        },

        /**
         * News一覧の各Gridがクリックされたときの動作
         * 
         * @param {jQuery.Event} ev
         * @param {Object} param
         * @memberOf NewsView#
         */
        onClickGridItem : function(ev, param) {
            var articleId = $(ev.currentTarget).attr("data-article-id");
            app.newsView = this;
            app.router.go("article", articleId);
        },

        /**
         * 指定された記事IDの記事を表示する。
         * @param articleId {String} 記事ID
         * @memberOf NewsView#
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
            case "7": // Facebook
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
            case "6": // おたより
                template = require("ldsh!templates/{mode}/news/letterDetail");
                ListItemView = EventListItemView;
                break;
            default:
                template = require("ldsh!templates/{mode}/news/eventsDetail");
                ListItemView = EventListItemView;
                break;
            }

            // 既にレンダリングされている要素をクリアする
            var dest = this.getView(NewsView.SELECTOR_ARTICLE_DESTINATION);
            if (dest) {
                dest.remove();
            }

            this.insertView(NewsView.SELECTOR_ARTICLE_DESTINATION, new ListItemView({
                model : model,
                template : template
            })).render();
            $("#contents__secondary").hide();
            $("#contents__primary").show();

            // TODO 各記事のviewで行いたい
            $("#snap-content").scrollTop(0);
            $(".backnumber-scroll-container").scrollTop(0);
        },

        /**
         * 初期スクロール位置が指定されている場合、スクロールする
         * @memberOf NewsView#
         */
        initScrollTop : function() {
            if (this.initialScrollTop) {
                this.setScrollTop(this.initialScrollTop);
            }
        },

        /**
         * 記事一覧の現在のスクロール位置を設定する
         * @param {Number} scrollTop
         * @memberOf NewsView#
         */
        setScrollTop : function(scrollTop) {
            var $container = this.$el.find("#contents__top");

            $container.scrollTop(scrollTop);
        },

        /**
         * 記事一覧の現在のスクロール位置を取得する
         * @return {Number}
         * @memberOf NewsView#
         */
        getScrollTop : function() {
            var $container = this.$el.find("#contents__top");
            var scrollTop = $container.scrollTop();

            return scrollTop;
        },

        /**
         * 記事詳細ページ以外では、記事詳細の要素を隠す
         * @memberOf NewsView#
         */
        onRoute : function(route) {
            if (route === "settings") {
            } else if (route === "showArticle") {
                $(NewsView.SELECTOR_ARTICLE_LIST).hide();
                $(NewsView.SELECTOR_ARTICLE_DESTINATION).show();
            } else {
                $(NewsView.SELECTOR_ARTICLE_LIST).show();
                $(NewsView.SELECTOR_ARTICLE_DESTINATION).hide();
            }

            $("#main").removeClass("is-top");
            $("#main").removeClass("is-article");
            $("#main").removeClass("is-backnumber");

            if (route === "top") {
                $("#main").addClass("is-top");
            } else if (route === "showArticle") {
                $("#main").addClass("is-article");
            } else if (route === "backnumber") {
                $("#main").addClass("is-backnumber");
            }
        },

        /**
         * ビューが破棄される時に呼ばれる
         * @memberOf NewsView#
         */
        cleanup : function() {
            $("#main").removeClass("is-top");
            $("#main").removeClass("is-article");
        },

        /**
         * Google Analyticsでページビューを記録する
         * @memberOf NewsView#
         */
        trackPageView : function() {
            app.ga.trackPageView("/NewsView", "ニュース");
        }
    }, {
        /**
         * 記事詳細を挿入する先のセレクタ
         */
        SELECTOR_ARTICLE_DESTINATION : "[data-news-detail]",

        /**
         * 記事一覧のセレクタ
         */
        SELECTOR_ARTICLE_LIST : "#contents__top"
    });

    module.exports = NewsView;
});

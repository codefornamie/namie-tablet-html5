define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var moment = require("moment");

    // view
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var GridListView = require("modules/view/news/GridListView");
    var RecommendArticleView = require("modules/view/news/RecommendArticleView");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var EventListItemView = require("modules/view/news/EventListItemView");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");
    var CondolenceListView = require("modules/view/news/condolence/CondolenceListView");

    // models
    var ArticleModel = require("modules/model/article/ArticleModel");

    // collections
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var RecommendCollection = require("modules/collection/article/RecommendCollection");
    var FavoriteCollection = require("modules/collection/article/FavoriteCollection");
    var EventsCollection = require("modules/collection/events/EventsCollection");
    var NewspaperHolidayCollection = require("modules/collection/misc/NewspaperHolidayCollection");

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
            var self = this;
            _.each(app.serverConfig.COLOR_LABEL, function(c) {
                self.$el.prepend("<style>.article-label--category" + c.id + "::after{" + 
                        "border-right-color: " + c.color + ";" +
                        "border-bottom-color: " + c.color + "}</style>");
            });
        },

        /**
         * 初期化処理
         * @memberOf NewsView#
         */
        initialize : function(options) {
            options = options || {};

            this.targetDate = this.targetDate || options.date;
            this.initialScrollTop = options.scrollTop || 0;

            // 休刊日情報の読み込み
            var holCol = new NewspaperHolidayCollection();
            holCol.prevPublished(this.targetDate, function(prev, isPublish, err) {
                if (err) {
                    app.logger.error("error NewsView:holCol.prevPublished()");
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("休刊日の取得に失敗しました。");
                    this.hideLoading();
                    return;
                }
                if (isPublish) {
                    // 記事読み込み範囲設定
                    this.setArticleSearchCondition(moment(prev).add(1, "d").toDate(), new Date(this.targetDate));
                    // 記事読み込み   
                    this.searchArticles();
                } else {
                    // 休刊日
                    this.hideLoading();
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("休刊日です。");
                }
            }.bind(this));
            this.initEvents();
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberOf NewsView#
         */
        setArticleSearchCondition : function(from, to) {
            this.articleCollection.setSearchConditionRange(from, to);
            this.recommendCollection.setSearchCondition({targetDate: from});
            this.eventsCollection.setSearchCondition({targetDate: from});
        },

        /**
         * イベントを初期化する
         * @memberOf NewsView#
         */
        initEvents : function() {
            this.listenTo(app.router, "route", this.onRoute);
            $(document).on("open:modal", this.onOpenModal.bind(this));
            $(document).on("close:modal", this.onCloseModal.bind(this));
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
            var cache = app.useCache;

            this.articleCollection.fetch({
                cache : cache,

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
                cache : app.useCache,

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
                cache : app.useCache,

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
                cache : app.useCache,

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

            // 新聞アプリおよび管理アプリプレビュー表示の場合、写真投稿、おくやみを1件の表示するための処理を行う
            this.summarizeArticle("8", {
                targetDate : targetDate,
                idPreffex : "condolence-",
                dispTitle : (moment(targetDate).format("YYYY年M月DD日")) + "の" + "おくやみ",
                sortOrder: -1
            });
            this.summarizeArticle("6", {
                targetDate : targetDate,
                idPreffex : "letter-",
                dispTitle : "みんなで投稿！撮れたて写真館",
                sortOrder: 1
            });

            // GridListView初期化
            this.showGridListView();

            this.hideLoading();
        },
        /**
         * 指定された記事タイプの記事を、１つの記事にまとめる
         * <p>
         * 指定された記事タイプの記事を１つの記事にまとめて、ArticleCollectionの先頭に挿入する。<br>
         * optionsパラメタに、まとめられた記事に関する、以下の情報を設定する。
         * <ul>
         * <li>idPreffex<br>
         * 作成する記事情報のIDのプレフィック</li>
         * <li>dispTitle<br>
         * 記事一覧に表示される記事タイトル</li>
         * </ul>
         * </p>
         * @param {String} type 記事タイプ
         * @param {Object} options 記事作成時のオプション情報
         * @memberOf NewsView#
         */
        summarizeArticle : function(type, options) {
            if (app.config.basic.mode === Code.APP_MODE_NEWS || this.isPreview) {
                
                // 指定された記事タイプのカテゴリ名を取得
                var articleCategory = _.find(Code.ARTICLE_CATEGORY_LIST, function(category) {
                    return category.key === type;
                });
                var siteLabel;
                if (articleCategory) {
                    siteLabel = articleCategory.value;
                }

                var newsArticles = this.newsCollection.toArray().concat();
                // 記事の掲載日の降順でソートする
                newsArticles.sort(function(a, b) {
                    var pa = a.get("publishedAt");
                    var pb = b.get("publishedAt");
                    if (pa === pb) {
                        return 0;
                    }
                    if (pa < pb) {
                        return options.sortOrder;
                    } else if (pa > pb) {
                        return -1 * options.sortOrder;
                    }
                });

                var articleDateMap = {};
                var imagePath;
                var imageThumbUrl;

                // newsCollectionからまとめる記事を削除し、配列に追加する
                _.each(newsArticles, $.proxy(function(article) {
                    if (article.get("type") !== type) {
                        return;
                    }

                    var publishedAt = article.get("publishedAt");
                    var articleModel = articleDateMap[publishedAt];
                    if (!articleModel) {
                        articleModel = new ArticleModel({
                            __id : options.idPreffex + (moment(publishedAt).format("YYYY-MM-DD")),
                            site : article.get("site"),
                            dispTitle : (moment(publishedAt).format("YYYY年M月DD日")) + "の" + siteLabel,
                            type : type,
                            articles : []
                        });
                        articleDateMap[article.get("publishedAt")] = articleModel;
                    }

                    var articleList = articleModel.get("articles");
                    this.newsCollection.remove(article);
                    articleList.push(article);

                    // 一番最初の記事のサムネイルを
                    // まとめた後の記事のサムネイルとして設定する
                    if (!imagePath) {
                        imagePath = article.get("imagePath");
                        imageThumbUrl = article.get("imageThumbUrl");
                    }
                }, this));

                var articleDateList = [];
                _.each(articleDateMap, function(articleDate) {
                    articleDateList.push(articleDate);
                });
                // 日付順にソートする
                articleDateList.sort(function(a, b) {
                    var pa = a.get("__id");
                    var pb = b.get("__id");
                    if (pa === pb) {
                        return 0;
                    }
                    if (pa < pb) {
                        return options.sortOrder;
                    } else if (pa > pb) {
                        return -1 * options.sortOrder;
                    }
                });
                // 写真投稿新着件数
                var newArrivals;
                if (type === "6") {
                    var currentPublishLetters = articleDateMap[app.currentPublishDate];
                    if (currentPublishLetters) {
                        newArrivals = currentPublishLetters.get("articles").length;
                    }
                }

                // まとめ記事画面を開くための記事を作成し、コレクションの先頭に登録
                var folderArticle = new ArticleModel({
                    __id : options.idPreffex + DateUtil.formatDate(options.targetDate, "yyyy-MM-dd"),
                    site : _.indexBy(app.serverConfig.COLOR_LABEL, "type")[type].label,
                    dispTitle : options.dispTitle,
                    type : type,
                    articles : articleDateList,
                    newArrivals : newArrivals,
                    imagePath : imagePath,
                    imageThumbUrl : imageThumbUrl
                });
                this.newsCollection.unshift(folderArticle);
                this.articleCollection.unshift(folderArticle);
            }
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
            this.$el.find(NewsView.SELECTOR_ARTICLE_LIST).hide();
            this.$el.find(NewsView.SELECTOR_NOTFOUND).show();
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
            case "6": // 写真投稿
                template = require("ldsh!templates/{mode}/news/letterDetail");
                ListItemView = EventListItemView;
                break;
            case "8": // おくやみ
                template = require("ldsh!templates/{mode}/news/condolence/condolenceList");
                ListItemView = CondolenceListView;
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
         * YYYY年MM月DD日版の新聞に戻るボタンの日付を更新する
         * @memberOf NewsView#
         */
        updateFooterButtons : function() {
            var self = this;
            var $btnGoTop = this.$el.find("#news-action").find("[data-gotop]");
            var $btnBack = this.$el.find("#news-action").find("[data-back]");
            var currentMoment = moment(app.currentDate);
            var currentDateStr = currentMoment.format("YYYY-MM-DD");

            $btnGoTop.on("click", function() {
                self.setScrollTop(0);
            });

            $btnBack.text(currentMoment.format("YYYY年MM月DD日版の新聞に戻る"));
            $btnBack.on("click", function(ev) {
                ev.preventDefault();
                app.router.go("top", currentDateStr);
            });
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
            var $container = $("#snap-content");

            $container.scrollTop(scrollTop);
        },

        /**
         * 記事一覧の現在のスクロール位置を取得する
         * @return {Number}
         * @memberOf NewsView#
         */
        getScrollTop : function() {
            var $container = $("#snap-content");
            var scrollTop = $container.scrollTop();

            return scrollTop;
        },

        /**
         * モーダルウィンドウが開いた後に呼ばれる
         * @memberOf TopView#
         */
        onOpenModal : function() {
            $("body").addClass("has-modal");
        },

        /**
         * モーダルウィンドウが閉じた後に呼ばれる
         * @memberOf TopView#
         */
        onCloseModal : function() {
            $("body").removeClass("has-modal");
        },

        /**
         * 記事詳細ページ以外では、記事詳細の要素を隠す
         * @memberOf NewsView#
         */
        onRoute : function(route) {
            if (route === "settings") {
            } else if (route === "showArticle") {
                $(NewsView.SELECTOR_ARTICLE_LIST).hide();
                $(NewsView.SELECTOR_ARTICLE_CONTAINER).show();
            } else {
                $(NewsView.SELECTOR_ARTICLE_LIST).show();
                $(NewsView.SELECTOR_ARTICLE_CONTAINER).hide();
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

            this.updateFooterButtons();
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
         * 記事詳細及び戻るボタンのコンテナのセレクタ
         */
        SELECTOR_ARTICLE_CONTAINER : "[data-news-container]",

        /**
         * 記事詳細を挿入する先のセレクタ
         */
        SELECTOR_ARTICLE_DESTINATION : "[data-news-detail]",

        /**
         * 記事一覧のセレクタ
         */
        SELECTOR_ARTICLE_LIST : "#contents__top",

        /**
         * 記事情報がない場合に出すnotificationのセレクタ
         */
        SELECTOR_NOTFOUND : "#not-found"
    });

    module.exports = NewsView;
});

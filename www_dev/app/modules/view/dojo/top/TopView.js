define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var AbstractView = require("modules/view/AbstractView");
    var DojoTabView = require("modules/view/dojo/top/DojoTabView");
    var DojoEditionView = require("modules/view/dojo/top/DojoEditionView");
    var DojoLevelView = require("modules/view/dojo/top/DojoLevelView");
    var DojoLessonView = require("modules/view/dojo/lesson/DojoLessonView");
    var DojoIntroductionView = require("modules/view/dojo/top/DojoIntroductionView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var YouTubeCollection = require("modules/collection/dojo/YouTubeCollection");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var DojoEditionCollection = require("modules/collection/dojo/DojoEditionCollection");
    var AchievementCollection = require("modules/collection/misc/AchievementCollection");
    var Code = require("modules/util/Code");
    var Equal = require("modules/util/filter/Equal");
    var IsNull = require("modules/util/filter/IsNull");
    
    /**
     * 道場アプリのLayout
     * 
     * @class
     * @exports TopView
     * @constructor
     */
    var DojoLayout = Backbone.Layout.extend({
        /**
         * このLayoutのテンプレートファイルパス
         */
        template : require("ldsh!templates/{mode}/top/top"),

        /**
         * イベント一覧
         */
        events: {
            "click a": "onClickAnchor"
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf DojoLayout#
         */
        initialize: function (param) {
            console.assert(this.dojoTabView, "DojoLayout should have a DojoTabView");
            console.assert(this.dojoEditionView, "DojoLayout should have a DojoEditionView");
            console.assert(this.dojoLevelView, "DojoLayout should have a DojoLevelView");
            console.assert(this.dojoLessonView, "DojoLayout should have a DojoLessonView");
            console.assert(this.dojoIntroductionView, "DojoLayout should have a DojoIntroductionView");

            this.dojoTabView = param.dojoTabView;
            this.dojoEditionView = param.dojoEditionView;
            this.dojoLevelView = param.dojoLevelView;
            this.dojoLessonView = param.dojoLessonView;
            this.dojoIntroductionView = param.dojoIntroductionView;

            this.hideLesson();
        },

        /**
         * コース内コンテンツ一覧画面を表示する
         * @param {Object} param
         * @memberOf DojoLayout#
         */
        showLevel: function (param) {
            console.assert(param, "param should be specified in order to show level page");
            console.assert(param.level !== null, "level should be specified in order to show level page");

            this.dojoLevelView.model.set("level", param.level);

            this.setView(DojoLayout.SELECTOR_LESSON, this.dojoLevelView.layout);
            this.removeView(DojoLayout.SELECTOR_TAB);
            this.removeView(DojoLayout.SELECTOR_EDITION);
        },

        /**
         * 詳細画面を表示する
         * @param {Object} param
         * @memberOf DojoLayout#
         */
        showLesson: function (param) {
            console.assert(param, "param should be specified in order to show lesson page");
            console.assert(param.dojoEditionModel, "dojoEditionModel should be specified in order to show lesson page");
            console.assert(param.dojoContentModel, "dojoContentModel should be specified in order to show lesson page");

            this.dojoLessonView.dojoEditionModel.set(param.dojoEditionModel.toJSON());
            this.dojoLessonView.dojoContentModel.set(param.dojoContentModel.toJSON());
            if (!param.dojoContentModel.achievementModels) {
                // achievementModels配列のインスタンスを共有するため、undefinedの場合はここで配列のインスタンスを生成する
                param.dojoContentModel.achievementModels = [];
            }
            this.dojoLessonView.dojoContentModel.achievementModels = param.dojoContentModel.achievementModels;

            this.setView(DojoLayout.SELECTOR_LESSON, this.dojoLessonView.layout);
            this.removeView(DojoLayout.SELECTOR_TAB);
            this.removeView(DojoLayout.SELECTOR_EDITION);
        },

        /**
         * 詳細画面を隠す
         * @memberOf DojoLayout#
         */
        hideLesson: function () {
            this.removeView(DojoLayout.SELECTOR_LESSON);
            this.setView(DojoLayout.SELECTOR_TAB, this.dojoTabView);
            this.setView(DojoLayout.SELECTOR_EDITION, this.dojoEditionView);
        },

        /**
         * 初回説明画面を表示する
         * @param {Object} param
         * @memberOf DojoLayout#
         */
        showIntroduction: function (param) {
            this.setView(DojoLayout.SELECTOR_INTRODUCTION, this.dojoIntroductionView);
        },

        /**
         * aタグをクリックした際の挙動を
         * ブラウザデフォルトではなく
         * pushStateに変更する
         * @param {Event} evt
         * @memberOf DojoLayout#
         */
        onClickAnchor: function (evt) {
            var $target = $(evt.currentTarget);
            var href = { prop: $target.prop("href"), attr: $target.attr("href") };
            var root = location.protocol + "//" + location.host + app.root;

            if (href.prop && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                app.router.navigate(href.attr, {
                    trigger: true,
                    replace: false
                });
            }
        }
    }, {
        /**
         * 詳細画面のセレクタ
         */
        SELECTOR_LESSON: "#dojo-lesson-container",

        /**
         * タブ部分のセレクタ
         */
        SELECTOR_TAB: "#dojo-tab-container",

        /**
         * 一覧のセレクタ
         */
        SELECTOR_EDITION: "#dojo-edition-container",

        /**
         * 初回説明画面のセレクタ
         */
        SELECTOR_INTRODUCTION: "#dojo-introduction-container",
    });

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf TopView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf TopView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化
         * @memberOf TopView#
         */
        initialize : function() {
            // ローディングを開始
            this.showLoading();

            this.currentEditionModel = new DojoEditionModel();
            this.initCollection();
            this.initLayout();
            this.initEvents();

            this.loadYouTubeLibrary($.proxy(function() {
                // youtubeAPI読み込み
                gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
                gapi.client.load('youtube', 'v3', $.proxy(this.searchDojoMovieList, this));
            }, this));
        },

        /**
         * collectionを初期化する
         * @memberOf TopView#
         */
        initCollection: function () {
            this.dojoContentCollection = new DojoContentCollection();
            this.dojoEditionCollection = new DojoEditionCollection();
        },

        /**
         * layoutを初期化する
         * @memberOf TopView#
         */
        initLayout: function () {
            // TopViewでDojoContentCollectionの変更を監視して
            // 各子ビュー(DojoTabViewとDojoEditionView)を更新する
            var dojoTabView = new DojoTabView({
                collection: this.dojoEditionCollection
            });
            var dojoEditionView = new DojoEditionView();
            var dojoLevelView = new DojoLevelView({
                dojoEditionModel: this.currentEditionModel
            });
            var dojoLessonView = new DojoLessonView();
            var dojoIntroductionView = new DojoIntroductionView();

            // layoutを初期化する
            this.layout = new DojoLayout({
                dojoTabView: dojoTabView,
                dojoEditionView: dojoEditionView,
                dojoLevelView: dojoLevelView,
                dojoLessonView: dojoLessonView,
                dojoIntroductionView: dojoIntroductionView
            });

            // 各子ビューをレンダリングする
            this.layout.render();
        },
        
        /**
         * イベントを初期化する
         * @memberOf TopView#
         */
        initEvents : function() {
            this.listenTo(this.dojoContentCollection, "sync", this.onSyncDojoContent);
            this.listenTo(this.dojoEditionCollection, "edition", this.onChangeEdition);
            this.listenTo(app.router, "route", this.onRoute);
        },
        /**
         * youtubeライブラリを読み込む
         * 
         * @memberOf TopView#
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
         * 道場動画の検索を実施
         * 
         * @memberOf TopView#
         */
        searchDojoMovieList : function() {
            this.youtubeCollection = new YouTubeCollection();
            // TODO 実際の道場動画チャンネルが作成されたら正しいチャンネルIDに変更する
            this.youtubeCollection.channelId = "UC9_ZCtgOk8dPC6boqZMNqbw";
            this.youtubeCollection.fetch({
                success : $.proxy(function() {
                    this.searchDojoInfo();
                }, this),
                error : function error() {
                    console.log("error");
                }
            });
        },

        /**
         * 道場情報の検索処理を開始する。
         * 
         * @memberOf TopView#
         */
        searchDojoInfo : function() {
            // 現在保持しているデータをクリア
            this.dojoContentCollection.reset();
            this.dojoContentCollection.youtubeCollection = this.youtubeCollection;
            this.dojoContentCollection.fetch({
                success : $.proxy(this.searchAchievement, this),
                error : function() {
                    app.logger.error("道場動画情報の検索に失敗しました。");
                    this.hideLoading();
                    return;
                }
            });
        },
        /**
         * 達成情報の検索処理を開始する。
         * 
         * @memberOf TopView#
         */
        searchAchievement : function() {
            // 達成情報を自身の情報のみに絞り込んで検索実施
            this.achievementCollection = new AchievementCollection();
            this.achievementCollection.condition.filters = [new Equal("userId", app.user.get("__id")), new IsNull(
                    "deletedAt")];
            this.achievementCollection.fetch({
                success : $.proxy(this.onSearchAchievement, this),
                error : function() {
                    app.logger.error("達成情報の検索に失敗しました。");
                    this.hideLoading();
                    return;
                }
            });
        },
        /**
         * 道場情報の検索処理が終了した場合に呼ばれるコールバック関数。
         * 
         * @memberOf TopView#
         */
        onSearchAchievement : function() {
            var isSolved = false;

            // 動画と達成情報の連結を行う
            if (this.achievementCollection.size() !== 0) {
                this.achievementCollection.each($.proxy(function(achievement) {
                    this.dojoContentCollection.each($.proxy(function(dojoContent) {
                        if (dojoContent.get("videoId") === achievement.get("action")) {
                            if (!dojoContent.achievementModels) {
                                dojoContent.achievementModels = [];
                            }
                            dojoContent.achievementModels.push(achievement);

                            if (!isSolved) {
                                isSolved = dojoContent.getSolvedState() === Code.DOJO_STATUS_SOLVED;
                            }
                        }
                    },this));
                },this));
            }
            this.onSyncDojoContent();
            this.hideLoading();

            var notAchievementedLevel = this.dojoContentCollection.getNotAchievementedLevel();
            for (var i = 0; i <= parseInt(notAchievementedLevel); i++) {
                $("#dojo-level-" + i).show();
            }

            // 「どの動画も達成されていない場合」にのみ初回説明画面を表示する
            if (!isSolved) {
                app.router.navigate("dojo-introduction", true);
            }
        },
        
        /**
         * this.dojoEditionCollectionを元に各子ビューを更新する
         * @memberOf TopView#
         */
        updateChildViews: function () {
            // 1. DojoTabViewの更新
            // DojoTabView は thisdojoEditionCollection への参照を保持しているので
            // 自動で更新されるようになっている

            // 2. DojoEditionViewの更新
            // DojoEditionViewに表示中のModelを更新する
            var dojoEditionView = this.layout.getView(DojoLayout.SELECTOR_EDITION);
            var currentEditionModel = this.dojoEditionCollection.getCurrentEdition();
            if (currentEditionModel) {
                this.currentEditionModel.set(currentEditionModel.toJSON());
                dojoEditionView.model.set(currentEditionModel.toJSON());
            }

            // 3. 各子ビューをレンダリングする
            this.layout.render();
        },

        /**
         * 道場コンテンツが更新されたら呼ばれる
         * @memberOf TopView#
         */
        onSyncDojoContent : function() {
            // DojoContentCollection から DojoEditionCollection を生成する
            // DojoEditionCollectionはタブ表示用のcollection
            var editionCollection = this.dojoContentCollection.groupByEditions();
            this.dojoEditionCollection.set(editionCollection);

            this.updateChildViews();
        },

        /**
         * ◯◯編が変更されたら呼ばれる
         * @memberOf TopView#
         */
        onChangeEdition: function () {
            this.updateChildViews();
        },

        /**
         * ルーティングを監視して描画処理を行う
         * @param {String} route
         * @param {Object} params
         * @memberOf TopView#
         */
        onRoute: function (route, params) {
            switch (route) {
            case "dojoTop":
                this.layout.hideLesson();
                break;

            case "dojoLevel":
                var level = params[0];

                app.currentDojoLevel = level;

                this.layout.hideLesson();
                this.layout.showLevel({
                    level: level
                });
                break;

            case "dojoLesson":
                var lessonId = params[0];
                var dojoContentModel = this.currentEditionModel.get("contentCollection").get(lessonId);

                this.layout.showLesson({
                    dojoEditionModel: this.currentEditionModel,
                    dojoContentModel: dojoContentModel
                });
                break;

            case "dojoIntroduction":
                this.layout.showIntroduction();
                break;

            default:
                break;
            }

            this.layout.render();
        }
    });

    module.exports = TopView;
});

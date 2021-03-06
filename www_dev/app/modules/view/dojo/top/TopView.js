/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var AbstractView = require("modules/view/AbstractView");
    var DojoTabView = require("modules/view/dojo/top/DojoTabView");
    var DojoEditionView = require("modules/view/dojo/top/DojoEditionView");
    var DojoLevelView = require("modules/view/dojo/top/DojoLevelView");
    var DojoLessonView = require("modules/view/dojo/lesson/DojoLessonView");
    var DojoLevelCompleteView = require("modules/view/dojo/top/DojoLevelCompleteView");
    var DojoIntroductionView = require("modules/view/dojo/top/DojoIntroductionView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var YouTubeCollection = require("modules/collection/dojo/YouTubeCollection");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var DojoEditionCollection = require("modules/collection/dojo/DojoEditionCollection");
    var AchievementCollection = require("modules/collection/misc/AchievementCollection");
    var Code = require("modules/util/Code");
    var Equal = require("modules/util/filter/Equal");
    var IsNull = require("modules/util/filter/IsNull");
    var CommonUtil = require("modules/util/CommonUtil");

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
            console.assert(this.dojoLevelCompleteView, "DojoLayout should have a DojoLevelCompleteView");
            console.assert(this.dojoIntroductionView, "DojoLayout should have a DojoIntroductionView");

            this.dojoTabView = param.dojoTabView;
            this.dojoEditionView = param.dojoEditionView;
            this.dojoLevelView = param.dojoLevelView;
            this.dojoLessonView = param.dojoLessonView;
            this.dojoLevelCompleteView = param.dojoLevelCompleteView;
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

            this.setView(DojoLayout.SELECTOR_LEVEL, this.dojoLevelView.layout);
            this.removeView(DojoLayout.SELECTOR_LESSON);
            this.removeView(DojoLayout.SELECTOR_LEVEL_COMPLETE);
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
            this.removeView(DojoLayout.SELECTOR_LEVEL_COMPLETE);
            this.removeView(DojoLayout.SELECTOR_TAB);
            this.removeView(DojoLayout.SELECTOR_EDITION);

            // [TODO] ページの途中でモーダルを開くと切れてしまう問題への応急処置
            $("#snap-content").scrollTop(0);
        },

        /**
         * 詳細画面を隠す
         * @memberOf DojoLayout#
         */
        hideLesson: function () {
            this.removeView(DojoLayout.SELECTOR_LEVEL);
            this.removeView(DojoLayout.SELECTOR_LESSON);
            this.removeView(DojoLayout.SELECTOR_LEVEL_COMPLETE);
            this.setView(DojoLayout.SELECTOR_TAB, this.dojoTabView);
            this.setView(DojoLayout.SELECTOR_EDITION, this.dojoEditionView);
        },

        /**
         * コース制覇画面を表示する
         * @param {Object} param
         * @memberOf DojoLayout#
         */
        showLevelComplete: function (param) {
            console.assert(param, "param should be specified in order to show level page");
            console.assert(param.level !== null, "level should be specified in order to show level complete page");

            this.dojoLevelCompleteView.model.set("level", param.level);

            this.setView(DojoLayout.SELECTOR_LEVEL_COMPLETE, this.dojoLevelCompleteView.layout);
            this.removeView(DojoLayout.SELECTOR_LESSON);
            this.removeView(DojoLayout.SELECTOR_TAB);
            this.removeView(DojoLayout.SELECTOR_EDITION);
        },

        /**
         * 初回説明画面を表示する
         * @param {Object} param
         * @memberOf DojoLayout#
         */
        showIntroduction: function (param) {
            this.dojoIntroductionView.isFirst = param.isFirst;
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
            if (href.attr) {
                var params = href.attr.split("/");
                if (params[1] === "levels") {
                    // コース選択がクリックされた場合
                    app.ga.trackEvent("コース選択ページ", "コース選択", params[2]);
                }
            }
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
         * コース内コンテンツ一覧画面のセレクタ
         */
        SELECTOR_LEVEL: "#dojo-level-container",

        /**
         * 詳細画面のセレクタ
         */
        SELECTOR_LESSON: "#dojo-lesson-container",

        /**
         * コース制覇画面のセレクタ
         */
        SELECTOR_LEVEL_COMPLETE: "#dojo-level-complete-container",

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

            this.loadYouTubeLibrary($.proxy(function(err) {
                if (!CommonUtil.isOnline()) {
                    err = "Network is Offline";
                }
                if (err) {
                    app.logger.info("Failed loading youtube library. error:" + err);
                    this.showMessage("Youtubeライブラリの読み込みに失敗しました。通信状態をご確認ください。");
                    this.hideLoading();
                } else {
                    // youtubeAPI読み込み
                    gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
                    gapi.client.load('youtube', 'v3', $.proxy(this.searchDojoMovieList, this));
                }

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
            var dojoLevelCompleteView = new DojoLevelCompleteView();
            var dojoIntroductionView = new DojoIntroductionView();

            // layoutを初期化する
            this.layout = new DojoLayout({
                dojoTabView: dojoTabView,
                dojoEditionView: dojoEditionView,
                dojoLevelView: dojoLevelView,
                dojoLessonView: dojoLessonView,
                dojoLevelCompleteView: dojoLevelCompleteView,
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

            $(document).on("open:modal", this.onOpenModal.bind(this));
            $(document).on("close:modal", this.onCloseModal.bind(this));
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
            this.youtubeCollection.channelId = "UCSeFpozPKXTm_frDTqccxpQ";
            this.youtubeCollection.fetch({
                success : $.proxy(function() {
                    this.searchDojoInfo();
                }, this),
                error : function error(model, resp, options) {
                    this.hideLoading();
                    this.showErrorMessage("道場動画情報の検索", resp);
                }.bind(this)
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
                error : function(model, resp, options) {
                    this.hideLoading();
                    this.showErrorMessage("道場動画情報の検索", resp);
                    return;
                }.bind(this)
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
                error : function(model, resp, options) {
                    this.hideLoading();
                    this.showErrorMessage("達成情報の検索", resp);
                    return;
                }.bind(this)
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

            // 段位情報が更新されたタイミングを他Viewからフックできるように
            // "achievement"イベントをトリガする
            this.dojoContentCollection.trigger("achievement");

            this.onSyncDojoContent();
            this.hideLoading();

            // 「どの動画も達成されていない場合」にのみ初回説明画面を表示する
            if (!isSolved) {
                app.router.navigate("dojo-introduction?first", true);
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
         * モーダルウィンドウが開いた後に呼ばれる
         * @memberOf TopView#
         */
        onOpenModal: function () {
            $("body").addClass("has-modal");
        },

        /**
         * モーダルウィンドウが閉じた後に呼ばれる
         * @memberOf TopView#
         */
        onCloseModal: function () {
            $("body").removeClass("has-modal");
        },

        /**
         * ルーティングを監視して描画処理を行う
         * @param {String} route
         * @param {Object} params
         * @memberOf TopView#
         */
        onRoute: function (route, params) {
            var level;

            switch (route) {
            case "dojoTop":
                this.layout.hideLesson();
                app.ga.trackPageView("Top", "コース選択ページ表示");
                break;

            case "dojoLevel":
                level = params[0];
                app.ga.trackPageView("Cource/cource=" + level, "コース内の動画選択ページ表示/コース番号=" + level);
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
                app.ga.trackEvent("コース内の動画選択ページ", "「再生する」ボタン押下", dojoContentModel.get("videoId"));
                break;

            case "dojoLevelComplete":
                level = params[0];

                this.layout.showLevelComplete({
                    level: level
                });
                break;

            case "dojoIntroduction":
                this.layout.showIntroduction({
                    isFirst : !!params[0]
                });
                app.ga.trackEvent("コース選択ページ", "「初めての方へ」選択");
                break;

            default:
                break;
            }

            this.layout.render();
        }
    });

    module.exports = TopView;
});

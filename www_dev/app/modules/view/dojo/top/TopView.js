define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoTabView = require("modules/view/dojo/top/DojoTabView");
    var DojoEditionView = require("modules/view/dojo/top/DojoEditionView");
    var DojoLessonView = require("modules/view/dojo/lesson/DojoLessonView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var DojoEditionCollection = require("modules/collection/dojo/DojoEditionCollection");
    
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
         */
        initialize: function (param) {
            console.assert(this.dojoTabView, "DojoLayout should have a DojoTabView");
            console.assert(this.dojoEditionView, "DojoLayout should have a DojoEditionView");
            console.assert(this.dojoLessonView, "DojoLayout should have a DojoLessonView");

            this.dojoTabView = param.dojoTabView;
            this.dojoEditionView = param.dojoEditionView;
            this.dojoLessonView = param.dojoLessonView;

            this.hideLesson();
        },

        /**
         * 詳細画面を表示する
         * @param {Object} param
         */
        showLesson: function (param) {
            console.assert(param, "param should be specified in order to show lesson page");
            console.assert(param.dojoEditionModel, "dojoEditionModel should be specified in order to show lesson page");
            console.assert(param.dojoContentModel, "dojoContentModel should be specified in order to show lesson page");

            this.dojoLessonView.dojoEditionModel.set(param.dojoEditionModel.toJSON());
            this.dojoLessonView.dojoContentModel.set(param.dojoContentModel.toJSON());

            this.setView(DojoLayout.SELECTOR_LESSON, this.dojoLessonView.layout);
            this.removeView(DojoLayout.SELECTOR_TAB);
            this.removeView(DojoLayout.SELECTOR_EDITION);
        },

        /**
         * 詳細画面を隠す
         */
        hideLesson: function () {
            this.removeView(DojoLayout.SELECTOR_LESSON);
            this.setView(DojoLayout.SELECTOR_TAB, this.dojoTabView);
            this.setView(DojoLayout.SELECTOR_EDITION, this.dojoEditionView);
        },

        /**
         * aタグをクリックした際の挙動を
         * ブラウザデフォルトではなく
         * pushStateに変更する
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
         * @memberof TopView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberof TopView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化
         * @memberof TopView#
         */
        initialize : function() {
            this.currentEditionModel = new DojoEditionModel();
            this.initCollection();
            this.initLayout();
            this.initEvents();

            // 道場コンテンツ(this.dojoContentCollection)を取得する
            this.setArticleSearchCondition({
                // TODO 実際の検索条件を指定する
                targetDate : new Date(2014, 10, 28)
            });
            this.searchArticles();
        },

        /**
         * collectionを初期化する
         * @memberof TopView#
         */
        initCollection: function () {
            this.dojoContentCollection = new DojoContentCollection();
            this.dojoEditionCollection = new DojoEditionCollection();
        },

        /**
         * layoutを初期化する
         * @memberof TopView#
         */
        initLayout: function () {
            // TopViewでDojoContentCollectionの変更を監視して
            // 各子ビュー(DojoTabViewとDojoEditionView)を更新する
            var dojoTabView = new DojoTabView({
                collection: this.dojoEditionCollection
            });
            var dojoEditionView = new DojoEditionView();
            var dojoLessonView = new DojoLessonView();

            // layoutを初期化する
            this.layout = new DojoLayout({
                dojoTabView: dojoTabView,
                dojoEditionView: dojoEditionView,
                dojoLessonView: dojoLessonView
            });

            // 各子ビューをレンダリングする
            this.layout.render();
        },
        
        /**
         * イベントを初期化する
         * @memberof TopView#
         */
        initEvents : function() {
            this.listenTo(this.dojoContentCollection, "sync", this.onSyncDojoContent);
            this.listenTo(this.dojoEditionCollection, "edition", this.onChangeEdition);
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} condition 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberof TopView#
         */
        setArticleSearchCondition : function(condition) {
            this.dojoContentCollection.setSearchCondition(condition);
        },

        /**
         * 記事の検索処理を開始する。
         * @memberof TopView#
         */
        searchArticles : function() {
            var self = this;

            // ローディングを開始
            this.showLoading();

            // 現在保持しているデータをクリア
            this.dojoContentCollection.reset();

            // データを取得する
            this.dojoContentCollection.fetch({
                success : function() {
                    self.hideLoading();
                },

                error : function onErrorLoadArticle(e) {
                    console.error(e);
                }
            });
        },
        
        /**
         * this.dojoEditionCollectionを元に各子ビューを更新する
         */
        updateChildViews: function () {
            // 1. DojoTabViewの更新
            // DojoTabView は thisdojoEditionCollection への参照を保持しているので
            // 自動で更新されるようになっている

            // 2. DojoEditionViewの更新
            // DojoEditionViewに表示中のModelを更新する
            var dojoEditionView = this.layout.getView(DojoLayout.SELECTOR_EDITION);
            var currentEditionModel = this.dojoEditionCollection.getCurrentEdition();
            this.currentEditionModel.set(currentEditionModel.toJSON());
            dojoEditionView.model.set(currentEditionModel.toJSON());

            // 3. 各子ビューをレンダリングする
            this.layout.render();
        },

        /**
         * 道場コンテンツが更新されたら呼ばれる
         * @memberof TopView#
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
         */
        onChangeEdition: function () {
            this.updateChildViews();
        },

        /**
         * ルーティングを監視して描画処理を行う
         * @param {String} route
         * @param {Object} params
         */
        onRoute: function (route, params) {
            switch (route) {
            case "dojoTop":
                this.layout.hideLesson();
                break;

            case "dojoLesson":
                var lessonId = params[0];
                var dojoContentModel = this.currentEditionModel.get("contentCollection").get(lessonId);

                this.layout.showLesson({
                    dojoEditionModel: this.currentEditionModel,
                    dojoContentModel: dojoContentModel
                });
                break;

            default:
                break;
            }

            this.layout.render();
        }
    });

    module.exports = TopView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var LetterListView = require("modules/view/letter/top/LetterListView");
    var LetterWizardView = require("modules/view/letter/wizard/LetterWizardView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var Equal = require("modules/util/filter/Equal");
    var And = require("modules/util/filter/And");
    var Code = require("modules/util/Code");

    /**
     * 町民投稿アプリのトップ画面を表示するためのLayoutクラスを作成する。
     * 
     * @class
     * @constructor
     */
    var LetterTopLayout = Backbone.Layout.extend({
        /**
         * このLayoutのテンプレートファイルパス
         */
        template : require("ldsh!templates/{mode}/top/top"),

        /**
         * イベント一覧
         */
        events : {
            "click a" : "onClickAnchor"
        },

        /**
         * 初期化
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.letterListView, "param.letterListView should be specified");

            this.letterListView = param.letterListView;
        },

        /**
         * 一覧画面を開く
         */
        showList: function () {
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD);
            this.setView(LetterTopLayout.SELECTOR_LETTER_LIST, this.letterListView);
        },

        /**
         * ウィザード画面を開く
         * @param {Number} step
         */
        showWizard: function (step) {
            var isRendered = !!this.getView(LetterTopLayout.SELECTOR_LETTER_WIZARD);

            // レンダリング済みならば何もしない
            if (!isRendered) {
                var letterWizardView = new LetterWizardView();

                this.removeView(LetterTopLayout.SELECTOR_LETTER_LIST);
                this.setView(LetterTopLayout.SELECTOR_LETTER_WIZARD, letterWizardView);
            }
        },

        /**
         * aタグをクリックした際の挙動を ブラウザデフォルトではなく pushStateに変更する
         */
        // TODO onClickAnchorメソッドが色々なファイルにコピペされているので、どこかにまとめる
        onClickAnchor : function(evt) {
            var $target = $(evt.currentTarget);
            var href = {
                prop : $target.prop("href"),
                attr : $target.attr("href")
            };
            var root = location.protocol + "//" + location.host + app.root;

            if (href.prop && href.attr[0] !== "#" && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                app.router.navigate(href.attr, {
                    trigger : true,
                    replace : false
                });
            }
        }
    }, {
        /**
         * ユーザーが投稿した記事一覧のセレクタ
         */
        SELECTOR_LETTER_LIST : "#letter-list-container",

        /**
         * ウィザード画面のセレクタ
         */
        SELECTOR_LETTER_WIZARD : "#letter-wizard-container"
    });

    /**
     * 町民投稿アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 町民投稿アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        /**
         * 初期化
         * @memberof TopView#
         * @param {Object} param
         */
        initialize : function(param) {
            this.initCollection();
            this.initLayout();
            this.initEvents();
        },

        /**
         * コレクションを初期化する
         * @memberof TopView#
         */
        initCollection : function() {
            this.letterCollection = new ArticleCollection();

            this.letterCollection.condition.filters = [
                new And([
                    new Equal("type", Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_POSTING]),
                    new Equal("createUserId", app.user.get("__id"))
                ])
            ];

            this.letterCollection.fetch();
        },

        /**
         * layoutを初期化する
         * @memberof TopView#
         */
        initLayout : function() {
            this.letterListView = new LetterListView({
                collection : this.letterCollection
            });

            this.layout = new LetterTopLayout({
                letterListView : this.letterListView
            });
        },

        /**
         * イベントを初期化する
         * @memberof TopView#
         */
        initEvents : function() {
            this.listenTo(app.router, "route", this.onRoute);
            this.listenTo(this.letterCollection, "sync", this.onSyncLetter);
            this.listenTo(this.letterCollection, "error", this.onErrorLetter);
        },

        /**
         * ルーティングを監視して描画処理を行う
         * @memberof TopView#
         * @param {String} route
         * @param {Object} params
         */
        onRoute : function(route, params) {
            switch (route) {
            case "letterList":
                this.layout.showList();
                break;

            case "letterDetail":
                break;

            case "letterEdit":
                var id = params[0];
                console.log("TODO 編集画面を開く id:%s", id);
                break;

            case "letterWizard":
                var queryString = params[1];
                var query = app.router.parseQueryString(queryString);
                var step = query.step;

                this.layout.showWizard(step);
                break;

            default:
                break;
            }

            this.layout.render();
        },

        /**
         * 記事一覧が読み込まれたら呼ばれる
         * @memberof TopView#
         */
        onSyncLetter : function() {
            this.layout.render();
            this.hideLoading();
        },

        /**
         * 記事一覧の読み込みに失敗したら呼ばれる
         * @memberof TopView#
         */
        onErrorLetter : function() {
            alert("記事一覧の取得に失敗しました");
            app.logger.error("記事一覧の取得に失敗しました");
            this.hideLoading();
        }
    });

    module.exports = TopView;
});

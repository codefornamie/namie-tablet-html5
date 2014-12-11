define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 記事一覧のViewクラス
     * 
     * @class 記事一覧のViewクラス
     * @exports LetterWizardView
     * @constructor
     */
    var LetterWizardView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/wizard/letterWizard"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         */
        afterRendered : function() {
        },

        /**
         * 初期化する
         */
        initialize: function () {
            this.initEvents();

            // 初期画面
            this.moveTo(1);
        },

        /**
         * イベントを初期化する
         */
        initEvents: function () {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * ウィザード内の指定のページヘ移動する
         * @param {Number} step
         */
        moveTo: function (step) {
            console.log("LetterWizardView %s", step);
        },

        /**
         * ルーティング時に呼ばれる
         * @param {String} route
         * @param {Array} params
         */
        onRoute: function (route, params) {
            var queryString = params[1];
            var query = app.router.parseQueryString(queryString);
            var step = query.step;

            this.moveTo(step);
        }
    }, {
        /**
         * リストのセレクタ
         */
        SELECTOR_LETTER_LIST : "#letter-list"
    });

    module.exports = LetterWizardView;
});
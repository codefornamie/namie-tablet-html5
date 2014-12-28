define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 記事編集画面のViewクラス
     * 
     * @class 記事編集画面のViewクラス
     * @exports LetterEditView
     * @constructor
     */
    var LetterEditView = AbstractView.extend({
        /**
         * @memberOf LetterEditView#
         */
        template : require("ldsh!templates/{mode}/edit/letterEdit"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterEditView#
         */
        afterRendered : function() {
        },

        /**
         * イベント一覧
         * @memberOf LetterEditView#
         */
        events : {
            "click [data-update-letter]" : "onClickUpdateLetter"
        },

        /**
         * 初期化する
         * @memberOf LetterEditView#
         */
        initialize : function() {
        },

        /**
         * 更新するボタンが押された後に呼ばれる
         * @param {Event} ev
         * @memberOf LetterEditView#
         */
        onClickUpdateLetter : function(ev) {
            alert("更新しました(DUMMY)");
            app.router.go("/letters");
        }
    });

    module.exports = LetterEditView;
});
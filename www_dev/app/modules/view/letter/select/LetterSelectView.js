define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 遷移先選択画面のViewクラス
     * 
     * @class 遷移先選択画面のViewクラス
     * @exports LetterSelectView
     * @constructor
     */
    var LetterSelectView = AbstractView.extend({
        /**
         * @memberOf LetterSelectView#
         */
        template : require("ldsh!templates/{mode}/select/letterSelect"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterSelectView#
         */
        afterRendered : function() {
        },

        /**
         * イベント一覧
         * @memberOf LetterSelectView#
         */
        events : {},

        /**
         * 初期化する
         * @memberOf LetterSelectView#
         */
        initialize : function() {
        }
    });

    module.exports = LetterSelectView;
});
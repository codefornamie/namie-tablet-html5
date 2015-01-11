define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 記事投稿完了画面のViewクラス
     * 
     * @class 記事投稿完了画面のViewクラス
     * @exports LetterWizardCompleteView
     * @constructor
     */
    var LetterWizardCompleteView = AbstractView.extend({
        /**
         * @memberOf LetterWizardCompleteView#
         */
        template : require("ldsh!templates/{mode}/wizard/letterWizardComplete"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterWizardCompleteView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化する
         * @memberOf LetterWizardCompleteView#
         */
        initialize : function() {
        }
    });

    module.exports = LetterWizardCompleteView;
});
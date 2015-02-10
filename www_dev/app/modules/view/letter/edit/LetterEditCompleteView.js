define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 記事編集完了画面のViewクラス
     * 
     * @class 記事編集完了画面のViewクラス
     * @exports LetterEditCompleteView
     * @constructor
     */
    var LetterEditCompleteView = AbstractView.extend({
        /**
         * @memberOf LetterEditCompleteView#
         */
        template : require("ldsh!templates/{mode}/edit/letterEditComplete"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterEditCompleteView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化する
         * @memberOf LetterEditCompleteView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.letterModel, "param.letterModel should be specified");

            this.model = param.letterModel;
        }
    });

    module.exports = LetterEditCompleteView;
});
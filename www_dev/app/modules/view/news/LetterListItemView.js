define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var GridListItemView = require("modules/view/news/GridListItemView");

    /**
     * 記事一覧の写真投稿コーナーのViewを作成する。
     * 
     * @class 記事一覧の写真投稿コーナーのView
     * @exports LetterListItemView
     * @constructor
     */
    var LetterListItemView = GridListItemView.extend({
        /**
         * このViewのテンプレートファイパス
         * @memberOf LetterListItemView#
         */
        template : require("ldsh!templates/{mode}/news/letterListItem")
    });

    module.exports = LetterListItemView;
});

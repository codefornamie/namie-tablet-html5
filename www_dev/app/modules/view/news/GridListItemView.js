define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListItemView = require("modules/view/news/FeedListItemView");

    /**
     * 記事一覧アイテム(メニュー用)のViewを作成する。
     * 
     * @class 記事一覧アイテム(メニュー用)のView
     * @exports GridListItemView
     * @constructor
     */
    var GridListItemView = FeedListItemView.extend({
        /**
         * このViewのテンプレートファイパス
         */
        template : require("ldsh!templates/{mode}/news/gridListItem"),

    });

    module.exports = GridListItemView;
});

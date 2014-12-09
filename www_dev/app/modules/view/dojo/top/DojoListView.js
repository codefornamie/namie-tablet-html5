define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListItemView = require("modules/view/dojo/top/DojoListItemView");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var FeedListView = require("modules/view/news/FeedListView");
    var Super = FeedListView;

    /**
     * 道場アプリのトップ画面にあるコンテンツ一覧を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoListView
     * @constructor
     */
    var DojoListView = FeedListView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberof DojoListView#
         */
        template : require("ldsh!templates/{mode}/top/dojoList"),

        /**
         * 記事一覧を表示する要素のセレクタ
         * @memberof DojoListView#
         */
        listElementSelector : "#dojo-list",

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberof DojoListView#
         */
        beforeRendered : function() {
            Super.prototype.beforeRendered.call(this);
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberof DojoListView#
         */
        afterRendered : function() {
            Super.prototype.afterRendered.call(this);
        },

        /**
         * 初期化
         * @memberof DojoListView#
         */
        initialize : function() {
            console.assert(this.collection, "DojoListView should have a collection");

            Super.prototype.setFeedListItemViewClass.call(this, DojoListItemView);
        }
    });

    module.exports = DojoListView;
});

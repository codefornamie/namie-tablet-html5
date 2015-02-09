define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var RadClusterListItemView = require("modules/view/rad/top/RadClusterListItemView");
    var FeedListView = require("modules/view/news/FeedListView");
    var Super = FeedListView;

    /**
     * 放射線アプリのクラスター一覧を表示するためのViewクラスを作成する。
     * 
     * @class 放射線アプリのクラスター一覧を表示するためのView
     * @exports RadClusterListView
     * @constructor
     */
    var RadClusterListView = FeedListView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf RadClusterListView#
         */
        template : require("ldsh!templates/{mode}/top/radClusterList"),

        /**
         * 項目一覧を表示する要素のセレクタ
         * @memberOf RadClusterListView#
         */
        listElementSelector : "#rad-cluster-list",

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadClusterListView#
         */
        afterRendered : function() {
            Super.prototype.afterRendered.call(this);
        },

        /**
         * 初期化
         * @memberOf RadClusterListView#
         */
        initialize : function() {
            Super.prototype.setFeedListItemViewClass.call(this, RadClusterListItemView);
        }
    });

    module.exports = RadClusterListView;
});

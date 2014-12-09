define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var FeedListView = require("modules/view/news/FeedListView");
    var GridListItemView = require("modules/view/news/GridListItemView");
    var Super = FeedListView;

    /**
     * 記事一覧(メニュー用)のViewクラスを作成する。
     * @class 記事一覧(メニュー用)のViewクラス
     * @exports GridListView
     * @constructor
     */
    var GridListView = FeedListView.extend({
        /**
         * 記事リストの要素を選択するためのセレクタ
         * @memberof GridListView#
         */
        listElementSelector : "#grid-list",
        /**
         * このViewのテンプレートファイルパス
         * @memberof GridListView#
         */
        template : require("ldsh!templates/news/news/gridList"),
        /**
         * このViewのイベント
         * @memberof GridListView#
         */
        events : {
            "click [data-grid-list-item]" : "onClickFeedListItem"
        },
        /**
         * Viewの描画処理の前に呼び出されるコールバック関数
         * <p>
         * 記事一覧を表示する処理を行う。
         * </p>
         * @memberof GridListView#
         */
        beforeRendered : function() {
            this.setFeedList();
        },

        /**
         * 初期化処理
         * @memberof GridListView#
         */
        initialize : function() {
            Super.prototype.setFeedListItemViewClass.call(this, GridListItemView);
        },
        /**
         * 記事リストアイテムをクリックされたときのコールバック関数
         * 
         * @param {Event} ev
         * @memberof GridListView#
         */
        onClickFeedListItem : function(ev) {
        }
    });

    module.exports = GridListView;
});

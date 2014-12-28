define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Masonry = require("masonry");
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
         * @memberOf GridListView#
         */
        listElementSelector : "#grid-list",

        /**
         * このViewのテンプレートファイルパス
         * @memberOf GridListView#
         */
        template : require("ldsh!templates/news/news/gridList"),

        /**
         * このViewのイベント
         * @memberOf GridListView#
         */
        events : {
            "click [data-grid-list-item]" : "onClickFeedListItem"
        },

        /**
         * Viewの描画処理の前に呼び出されるコールバック関数
         * <p>
         * 記事一覧を表示する処理を行う。
         * </p>
         * @memberOf GridListView#
         */
        beforeRendered : function() {
            this.setFeedList();
        },

        /**
         * Viewの描画処理の後に呼び出されるコールバック関数
         * @memberOf GridListView#
         */
        afterRendered : function() {
            if (this.masonry) {
                this.masonry.destroy();
            }

            this.masonry = new Masonry(
                document.querySelector("#grid-list"),
                {
                    itemSelector: ".grid-list-item-div",
                    transitionDuration: 0
                }
            );
        },

        /**
         * 初期化処理
         * @memberOf GridListView#
         */
        initialize : function() {
            Super.prototype.setFeedListItemViewClass.call(this, GridListItemView);

            this.initEvent();
        },

        /**
         * イベント処理
         * @memberOf GridListView#
         */
        initEvent : function() {
            this.$el.on("imageError", this.onImageError.bind(this));
        },

        /**
         * 記事リストアイテムをクリックされたときのコールバック関数
         * 
         * @param {Event} ev
         * @memberOf GridListView#
         */
        onClickFeedListItem : function(ev) {
        },

        /**
         * 子ビューで画像読み込みに失敗したときに呼ばれる
         * 
         * @memberOf GridListView#
         */
        onImageError : _.debounce(function() {
            if (this.masonry) {
                this.masonry.layout();
            }
        }, 100)
    });

    module.exports = GridListView;
});

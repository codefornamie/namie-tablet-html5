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
        template : require("ldsh!templates/{mode}/news/gridList"),

        events : {
            "click [data-grid-list-item]" : "onClickFeedListItem"
        },

        beforeRendered : function() {
            this.setFeedList();
        },

        afterRendered : function() {
        },

        /**
         * 初期化処理
         */
        initialize : function() {
            Super.prototype.setFeedListItemViewClass.call(this, GridListItemView);
        },

        /**
         * 取得した動画一覧を描画する
         */
        setFeedList : function() {
            var self = this;

            this.collection.each(function(model) {
                var ItemView = self.feedListItemViewClass;

                self.insertView("#grid-list", new ItemView({
                    model : model,
                    parentView : self
                }));
            });
        },

        /**
         * 記事リストアイテムをクリックされたときのコールバック関数
         * 
         * @param {Event} ev
         */
        onClickFeedListItem : function(ev) {
        }
    });

    module.exports = GridListView;
});

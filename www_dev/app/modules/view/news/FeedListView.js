define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var FeedListItemView = require("modules/view/news/FeedListItemView");

    /**
     * 記事一覧(メニュー用)のViewクラスを作成する。
     * @class 記事一覧(メニュー用)のViewクラス
     * @exports FeedListView
     * @constructor
     */
    var FeedListView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/feedList"),
        events: {
            "click .feedListItem" : "onClickFeedListItem"
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
            this.setFeedListItemViewClass(FeedListItemView);
        },
        /**
         * FeedListItemViewのクラスを設定する。
         * <p>
         * 本クラスの派生クラスは、このメソッドを利用して、このリストの項目の表示に利用されるViewクラスを指定することができる。
         * </p>
         * @param {Object} Viewクラス
         */
        setFeedListItemViewClass: function(itemViewClass) {
            this.feedListItemViewClass = itemViewClass;
        },
        /**
         * 取得した動画一覧を描画する
         */
        setFeedList : function() {
            var self = this;
            var animationDeley = 0;
            this.collection.each($.proxy(function(model) {
                var itemView = self.feedListItemViewClass;
                this.insertView("#feedList", new itemView({
                    model : model,
                    animationDeley : animationDeley
                }));
                animationDeley += 0.2;
            }, this));
        },
        /**
         * 記事リストアイテムをクリックされたときのコールバック関数
         *
         *  @param {Event} ev
         */
        onClickFeedListItem : function(ev) {
            // クリックされたフィードに対応する記事のスクロール位置取得
            var articleId = $(ev.currentTarget).attr("data-article-id");

            app.ga.trackEvent("ニュース", "記事参照", articleId);


            app.trigger('scrollToArticle', {
                articleId: articleId
            });
        },
    });

    module.exports = FeedListView;
});

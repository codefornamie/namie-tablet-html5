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
        /**
         * このViewのテンプレートファイルパス
         * @memberOf FeedListView#
         */
        template : require("ldsh!templates/{mode}/news/feedList"),
        /**
         * 記事一覧を表示する要素のセレクタ
         * @memberOf FeedListView#
         */
        listElementSelector: "#feedList",
        /**
         * このViewのイベント
         * @memberOf FeedListView#
         */
        events: {
            "click .feedListItem" : "onClickFeedListItem"
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf FeedListView#
         */
        beforeRendered : function() {
            this.setFeedList();
        },

        /**
         * 初期化処理
         * @memberOf FeedListView#
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
         * @memberOf FeedListView#
         */
        setFeedListItemViewClass: function(itemViewClass) {
            this.feedListItemViewClass = itemViewClass;
        },
        /**
         * 取得した動画一覧を描画する
         * @memberOf FeedListView#
         */
        setFeedList : function() {
            var self = this;
            var animationDeley = 0;
            this.collection.each($.proxy(function(model) {
                var ItemView = self.feedListItemViewClass;
                this.insertView(this.listElementSelector, new ItemView({
                    model : model,
                    animationDeley : animationDeley,
                    parentView: this
                }));
                animationDeley += 0.2;
            }, this));
        },
        /**
         * 記事リストアイテムをクリックされたときのコールバック関数
         * 
         * @param {Event} ev クリックイベント
         * @memberOf FeedListView#
         */
        onClickFeedListItem : function(ev) {
            // クリックされたフィードに対応する記事のスクロール位置取得
            var articleId = $(ev.currentTarget).attr("data-article-id");
            var targetArticle = this.collection.find(function(model) {
                return model.get("__id") === articleId;
            });
            if (targetArticle) {
                app.ga.trackEvent("ニュース", "記事参照", targetArticle.get("title"));
            }


            $(document).trigger('scrollToArticle', {
                articleId: articleId
            });
        },
    });

    module.exports = FeedListView;
});

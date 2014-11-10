define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var FeedListItemView = require("modules/view/news/FeedListItemView");

    /**
     * 記事一覧(メニュー用)のViewクラス
     */
    var FeedListView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/feedList"),
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

        },
        /**
         * 取得した動画一覧を描画する
         */
        setFeedList : function() {
            var self = this;
            var animationDeley = 0;
            this.collection.each($.proxy(function(model) {
                var itemView = new FeedListItemView();
                this.insertView("#feedList", new FeedListItemView({
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
            var heightTopBar = $('.top-bar').height();
            var heightGlobalNav = $('.global-nav').height();
            var position = $("#" + articleId).offset().top - heightTopBar - heightGlobalNav;
            
            // 現在の記事詳細のスクロール位置と相対位置を加算した箇所までスクロールする
            $(".contents__primary").animate({
                scrollTop : position + $(".contents__primary").scrollTop()
            }, {
                queue : false
            });
        },
    });

    module.exports = FeedListView;
});

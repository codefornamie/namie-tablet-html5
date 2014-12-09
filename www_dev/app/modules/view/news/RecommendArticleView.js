define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListItemView = require("modules/view/news/FeedListItemView");

    /**
     * おすすめ記事のViewを作成する。
     * 
     * @class おすすめ記事のView
     * @exports RecommendArticleView
     * @constructor
     */
    var RecommendArticleView = FeedListItemView.extend({
        /**
         * このViewを表示する際に利用するアニメーション
         */
        animation : 'fadeIn',
        /**
         * このViewのテンプレートファイパス
         */
        template : require("ldsh!templates/{mode}/news/recommendArticle"),

        events : {
            "click .feedListItem" : "onClickFeedListItem"
        },

        /**
         * おすすめ記事をクリックされたときのコールバック関数
         * 
         * @param {Event} ev
         */
        onClickFeedListItem : function(ev) {
            app.ga.trackEvent("ニュース", "おすすめ記事参照", this.model.get("title"));

            $(document).trigger('scrollToArticle', {
                articleId : this.model.get("__id")
            });
        }

    });

    module.exports = RecommendArticleView;
});

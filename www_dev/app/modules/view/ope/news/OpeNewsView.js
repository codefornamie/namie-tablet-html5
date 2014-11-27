define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var NewsView = require("modules/view/news/NewsView");
    var OpeFeedListView = require("modules/view/ope/news/OpeFeedListView");
    var OpeFeedListItemView = require("modules/view/ope/news/OpeFeedListItemView");
    /**
     * 運用管理アプリの記事一覧画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリの記事一覧画面を表示するためのView
     * @exports OpeNewsView
     * @constructor
     */
    var OpeNewsView = NewsView.extend({
        /**
         * 記事一覧を表示する要素のセレクタ
         */
        feedListElement : '#article_list',
        events : {
            "click [data-article-register-button]" : "onClickArticleRegisterButton"
        },
        /**
         * 左ペインの記事一覧メニューを表示する。
         */
        showArticleListView : function() {
            return;
        },
        /**
         * 記事一覧を表示するViewのインスタンスを作成して返す。
         * @return {FeedListView} 生成したFeedListViewのインスタンス
         */
        createFeedListView : function() {
            if (this.notFoundMessage) {
                this.notFoundMessage.hide("slow");
            }
            var listView = new OpeFeedListView();
            listView.setFeedListItemViewClass(OpeFeedListItemView);
            return listView;
        },
        /**
         * 記事が見つからなかった場合のメッセージを画面に表示する。
         */
        showFeetNotFoundMessage : function() {
            this.notFoundMessage = $('<div data-alert class="alert-box info radius">指定された日付には記事がありません。</div>').insertBefore(
                    $(this.el).find("#feedList").parent());
        },
        /**
         *  新規記事投稿ボタン押下時に呼び出されるコールバック関数
         */
        onClickArticleRegisterButton: function () {
            app.router.opeArticleRegist();
        },
    });

    module.exports = OpeNewsView;
});
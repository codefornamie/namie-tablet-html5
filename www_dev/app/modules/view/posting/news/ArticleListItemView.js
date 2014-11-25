define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var TabletArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports ArticleListItemView
     * @constructor
     */
    var ArticleListItemView = TabletArticleListItemView.extend({
        template : require("ldsh!templates/{mode}/news/articleListItem"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
//            this.showImage();
        },

        /**
         * このViewのイベントを定義する。
         */
        events : {
            "click a" : "onClickAnchorTag",
            "click [data-goto-detail]" : "onClickGotoDetail",
            "click [data-goto-report]" : "onClickGotoReport"
        },

        /**
         * イベント詳細ボタンをクリックされたときのコールバック関数
         *
         *  @param {Event} ev
         */
        onClickGotoDetail : function(ev) {
            var model = this.model;

            app.router.articleDetail({
                model: model
            });
        }
    });
    module.exports = ArticleListItemView;
});

/* global LocalFileSystem */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports OpeArticleDetailView
     * @constructor
     */
    var OpeArticleDetailView = ArticleListItemView.extend({
        /**
         * このViewを表示する際に利用するアニメーション
         * @memberof OpeArticleDetailView#
         */
        template : require("ldsh!templates/{mode}/news/articleDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberof OpeArticleDetailView#
         * 
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.showImage();
            this.afterRenderCommon();
            this.hideLoading();
        },

        /**
         * このViewのイベントを定義する。
         * @memberof OpeArticleDetailView#
         */
        events : {
            'click [data-goto-cancel]' : 'onClickGotoCancel'
        },
        /**
         * キャンセルボタンをクリックしたら呼ばれる
         * @memberof OpeArticleDetailView#
         */
        onClickGotoCancel : function() {
            app.router.go("ope-top");
        }

    });
    module.exports = OpeArticleDetailView;
});

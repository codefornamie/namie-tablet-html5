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
         * @memberOf OpeArticleDetailView#
         */
        template : require("ldsh!templates/ope/news/articleDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeArticleDetailView#
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
         * @memberOf OpeArticleDetailView#
         */
        events : {
            'click [data-goto-cancel]' : 'onClickGotoCancel',
            "click a:not(.expansionPicture)" : "onClickAnchorTag"
        },
        /**
         * キャンセルボタンをクリックしたら呼ばれる
         * @memberOf OpeArticleDetailView#
         */
        onClickGotoCancel : function() {
            app.router.go("ope-top",this.targetDate);
        }

    });
    module.exports = OpeArticleDetailView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleDetailView = require("modules/view/posting/news/ArticleDetailView");

    /**
     * 記事詳細画面のViewクラス
     * 
     * @class 記事詳細画面のViewクラス
     * @exports OpeEventDetailView
     * @constructor
     */
    var OpeEventDetailView = ArticleDetailView.extend({
        /**
         *  テンプレートファイル
         * @memberof OpeEventDetailView#
         */
        template : require("ldsh!templates/{mode}/news/eventDetail"),
        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberof OpeEventDetailView#
         */
        afterRendered : function() {
            this.showImage();
            this.hideLoading();
        },
        /**
         *  編集ボタンをクリックしたら呼ばれる
         * @memberof OpeEventDetailView#
         */
        onClickGotoEdit: function () {
            this.showLoading();
            app.router.opeArticleRegist({
                model: this.model,
                recommendArticle : this.recommendArticle,
                backFunction : $.proxy(function() {
                    app.router.opeEventDetail({
                    model : this.model,
                    recommendArticle : this.recommendArticle
                })
                },this)
            });
        },
        /**
         *  キャンセルボタンをクリックしたら呼ばれる
         * @memberof OpeEventDetailView#
         */
        onClickGotoCancel: function () {
            app.router.go("ope-top");
        }
    });
    module.exports = OpeEventDetailView;
});

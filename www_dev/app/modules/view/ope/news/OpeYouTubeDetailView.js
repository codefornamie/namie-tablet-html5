define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var OpeYouTubeRegistConfirmView = require("modules/view/ope/news/OpeYouTubeRegistConfirmView");
    var vexDialog = require("vexDialog");

    /**
     * YouTube詳細画面のViewクラス
     * 
     * @class YouTube詳細画面のViewクラス
     * @exports OpeYouTubeDetailView
     * @constructor
     */
    var OpeYouTubeDetailView = OpeYouTubeRegistConfirmView.extend({
        template : require("ldsh!templates/{mode}/news/youtubeDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberof OpeYouTubeDetailView#
         * 
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.showImage();
            $("#articleRecommend").text(this.model.get("isRecommend") ? "する" : "しない");
            this.hideLoading();
        },
        events : {
            'click [data-goto-edit]' : 'onClickGotoEdit',
            'click [data-goto-cancel]' : 'onClickGotoCancel',
        },
        /**
         * 編集ボタンをクリックしたら呼ばれる
         * @memberof OpeYouTubeDetailView#
         */
        onClickGotoEdit : function() {
            this.showLoading();
            app.router.opeYouTubeRegist({
                model : this.model,
                recommendArticle : this.recommendArticle,
                backFunction : $.proxy(function() {
                    app.router.opeYouTubeDetail({
                        model : this.model,
                        recommendArticle : this.recommendArticle
                    })
                }, this)
            });
        },
        /**
         * キャンセルボタンをクリックしたら呼ばれる
         * @memberof OpeYouTubeDetailView#
         */
        onClickGotoCancel : function() {
            app.router.go("ope-top");
        }

    });
    module.exports = OpeYouTubeDetailView;
});

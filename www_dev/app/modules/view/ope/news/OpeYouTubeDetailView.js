define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var OpeYouTubeRegistConfirmView = require("modules/view/ope/news/OpeYouTubeRegistConfirmView");
    var vexDialog = require("vexDialog");

    /**
     * YouTube編集確認画面のViewクラス
     * 
     * @class YouTube編集確認画面のViewクラス
     * @exports OpeYouTubeRegistConfirmView
     * @constructor
     */
    var OpeYouTubeDetailView = YouTubeListItemView.extend({
        template : require("ldsh!templates/{mode}/news/youtubeDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberof OpeYouTubeDetailView#
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.showImage();
            $("#articleRecommend").text(this.model.get("isRecommend") ? "する":"しない");
            this.hideLoading();
        },
        events : {
        },
    });
    module.exports = OpeYouTubeDetailView;
});

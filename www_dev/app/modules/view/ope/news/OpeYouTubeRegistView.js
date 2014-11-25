define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");

    /**
     * YouTube編集画面のViewクラス
     * 
     * @class YouTube編集画面のViewクラス
     * @exports YouTubeRegistView
     * @constructor
     */
    var OpeYouTubeRegistView = YouTubeListItemView.extend({
        template : require("ldsh!templates/{mode}/news/youtubeRegist"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            // TODO データ読み込み終わったら以下を実行
            this.showImage();
        },

    });
    module.exports = OpeYouTubeRegistView;
});

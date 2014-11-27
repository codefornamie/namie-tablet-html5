define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");
    var OpeYouTubeRegistConfirmView = require("modules/view/ope/news/OpeYouTubeRegistConfirmView");

    /**
     * YouTube編集画面のViewクラス
     * 
     * @class YouTube編集画面のViewクラス
     * @exports OpeYouTubeRegistView
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
            this.showImage();
            $("#articleTitle").val(this.model.get("title"));
            $("#articleDetail").val(this.model.get("description"));
            if (this.model.get("isRecommend")) {
                $("#articleRecommendCheck").attr("checked","checked");
            }
            this.hideLoading();
        },
        events : {
            "click #articleConfirmButton" : "onArticleConfirmButton",
            "click #articleCancelButton" : "onClickArticleCancelButton"
        },
        /**
         * 確認画面へボタンが押下された際のコールバック関数
         */
        onArticleConfirmButton : function() {
            this.setInputValue();
            $("#youtubeRegistPage").hide();
            this.setView("#articleRegistConfirmWrapperPage", new OpeYouTubeRegistConfirmView({
                model : this.model,
                recommendArticle : this.recommendArticle
            })).render();
            $("#snap-content").scrollTop(0);
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         */
        onClickArticleCancelButton: function () {
            app.router.back();
        },
        setInputValue : function() {
            this.model.set("title", $("#articleTitle").val());
            this.model.set("description", $("#articleDetail").val());
            this.model.set("isRecommend",$("#articleRecommendCheck").is(":checked") ? "true" : null);
        }

    });
    module.exports = OpeYouTubeRegistView;
});

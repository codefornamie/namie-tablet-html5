define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");
    var vexDialog = require("vexDialog");

    /**
     * YouTube編集確認画面のViewクラス
     * 
     * @class YouTube編集確認画面のViewクラス
     * @exports OpeYouTubeRegistConfirmView
     * @constructor
     */
    var OpeYouTubeRegistConfirmView = YouTubeListItemView.extend({
        template : require("ldsh!templates/{mode}/news/youtubeRegistConfirm"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            // TODO データ読み込み終わったら以下を実行
            this.showImage();
            $("#articleRecommend").text($("#articleRecommendCheck").is(":checked") ? "する":"しない");
            this.hideLoading();
        },
        events : {
            "click #articleBackButton" : "onClickArticleBackButton",
            "click #articleRegistButton" : "onClickArticleRegistButton"
        },
        /**
         * 戻るボタンが押下された際のコールバック関数
         */
        onClickArticleBackButton : function() {
            this.$el.remove();
            $("#youtubeRegistPage").show();
            $("#snap-content").scrollTop(0);
        },
        /**
         * 登録するボタンが押下された際のコールバック関数
         */
        onClickArticleRegistButton : function() {
            this.showLoading();
            this.saveModel();
        },
        saveModel : function() {
            this.model.save(null, {
                success : $.proxy(function() {
                    if (this.model.get("isRecommend") && this.recommendArticle
                            && this.recommendArticle.get("__id") !== this.model.get("__id")) {
                        this.recommendArticle.set("isRecommend",null);
                        this.recommendArticle.save(null, {
                            success:$.proxy(function() {
                                app.router.go("ope-top");
                            },this),
                            error:$.proxy(function() {
                                app.router.go("ope-top");
                            },this)
                        });
                    }else {
                        app.router.go("ope-top");
                    }
                }, this),
                error : function(e) {
                    this.hideLoading();
                    vexDialog.alert("保存に失敗しました。");
                }
            });
        },
        /**
         * YouTube動画プレイヤーの設定を行う。
         */
        setYouTubePlayer : function() {
            this.player = new YT.Player('youtubePlayer', {
                width : '640',
                height : '390',
                playerVars : {
                    'autoplay' : 0,
                    'controls' : 1
                },
                events : {
                    "onReady" : $.proxy(this.onSetYouTubePlayer, this)
                }
            });
        },
    });
    module.exports = OpeYouTubeRegistConfirmView;
});

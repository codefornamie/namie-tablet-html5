define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var vexDialog = require("vexDialog");

    /**
     * 記事登録確認画面のViewクラス
     * 
     * @class 記事登録確認画面のViewクラス
     * @exports ArticleRegistConfirmView
     * @constructor
     */
    var ArticleRegistConfirmView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/articleRegistConfirm"),
        beforeRendered : function() {

        },

        afterRendered : function() {
            // 日時
            var dateString = this.model.getDateString();
            $("#articleDateTime").html(dateString);

            // 掲載期間
            var pubDateString = this.model.getPubDateString();
            $("#articlePublishRange").text("掲載期間： " + pubDateString);

            // 内容
            $("#articleDescription").html(CommonUtil.sanitizing(this.model.get("description")));

            // 連絡先
            $("#articleContactInfo").html(CommonUtil.sanitizing(this.model.get("contactInfo")));

            // 画像
            var $figure = this.$el.find('[data-figure]');
            var images = this.model.get('images');
            var imgIndex = 0;

            $figure.each(function (i) {
                var $image = $(this).find('[data-figure-image]');
                var $caption = $(this).find('[data-figure-caption]');
                var image = images[i];

                if (!image) {
                    return true;
                }

                $image.attr('src', image.src);
                $caption.text(image.comment);
            });

            // おすすめ
            $("#articleRecommend").text($("#articleRecommendCheck").is(":checked") ? "する":"しない");
        },

        /**
         *  初期化処理
         */
        initialize : function() {
        },

        events : {
            "click #articleBackButton" : "onClickArticleBackButton",
            "click #articleRegistButton" : "onClickArticleRegistButton"
        },

        /**
         * 戻るボタンを押下された際に呼び出されるコールバック関数。
         */
        onClickArticleBackButton : function(){
            this.$el.remove();
            $("#articleRegistPage").show();
            $("#snap-content").scrollTop(0);
        },

        /**
         * 登録するボタンが押下された際に呼び出されるコールバック関数。
         */
        onClickArticleRegistButton : function() {
            this.showLoading();
            this.saveArticlePicture();
        },
        /**
         * 添付された画像をdavへ登録する
         */
        saveArticlePicture : function() {
            var imageCount = this.model.get("images").length;
            if(imageCount === 0){
                this.hideLoading();
                this.saveModel();
                return;
            }
            _.each(this.model.get("images"), $.proxy(function(image){
                if(image.data){
                    app.box.col("dav").put(image.fileName, {
                        body : image.data,
                        headers : {
                            "Content-Type" : image.contentType,
                            "If-Match" : "*"
                        },
                        success : $.proxy(function(e){
                            if(--imageCount <= 0){
                                this.saveModel();
                            }
                        }, this),
                        error: $.proxy(function(e){
                            this.hideLoading();
                            vexDialog.defaultOptions.className = 'vex-theme-default';
                            vexDialog.alert("保存に失敗しました。");
                        }, this)
                    });
                }else{
                    if(--imageCount <= 0){
                        this.saveModel();
                    }
                }
            }, this));
        },
        /**
         * Modelの保存
         */
        saveModel : function(){
            this.model.save(null, {
                success : $.proxy(function() {
                    if (Backbone.history.fragment == 'opeArticleRegist') {
                        app.router.go("ope-top");
                        return;
                    }
                    app.router.go("posting-top");
                }, this),
                error: function(e){
                    this.hideLoading();
                    vexDialog.alert("保存に失敗しました。");
                }
            });
        }
    });
    module.exports = ArticleRegistConfirmView;
});

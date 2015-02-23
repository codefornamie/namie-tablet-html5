define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");
    var AbstractView = require("modules/view/AbstractView");
    var WebDavModel = require("modules/model/WebDavModel");
    
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
            $("#articlePublishRange").text("掲載期間：" + pubDateString);

            // 内容
            $("#articleDescription").html(CommonUtil.sanitizing(this.model.get("description")));

            // 連絡先
            $("#articleContactInfo").html(CommonUtil.sanitizing(this.model.get("contactInfo")));

            var type = this.model.get("type");
            if ( type !== "1" && type !== "2" && type !== "7" && type !== "8" ) {
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
            }

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
            $("#contents__primary").scrollTop(0);
        },

        /**
         * 登録するボタンが押下された際に呼び出されるコールバック関数。
         */
        onClickArticleRegistButton : function() {
            this.showLoading();
            var type = this.model.get("type");
            if ( type !== "1" && type !== "2" && type !== "7" && type !== "8" ) {
                this.saveArticlePicture();
            } else {
                this.saveModel();
            }
        },
        /**
         * 添付された画像をdavへ登録する
         */
        saveArticlePicture : function() {
            if(!this.model.get("__id")){
                this.model.id = AbstractModel.createNewId();
            }
            
            if(!this.model.get("imagePath")){
                this.model.set("imagePath", this.generateFilePath());
            }

            var images = this.model.get("images");
            this.makeThmbnail(images[0], $.proxy(function(blob){
                this.file.thumb = blob;
            }, this));
            var davs = [];
            _.each(images, $.proxy(function(image){
                if(image.data){
                    if(!this.model.get("__id")){
                        this.model.id = AbstractModel.createNewId();
                    }

                    if(!this.model.get("imagePath")){
                        this.model.set("imagePath", this.generateFilePath());
                    }

                    var davModel = new WebDavModel();
                    davModel.set("path", this.model.get("imagePath"));
                    davModel.set("fileName", image.fileName);
                    
                    davModel.set("data", image.data);
                    davModel.set("contentType", image.contentType);
                    davs.push(davModel);
                }
            }, this));

            var imageCount = images.length;
            if(imageCount === 0){
                this.saveModel();
                return;
            }

            if(this.thumbImageByteArray) {
                // サムネイル画像の生成が必要な場合(新規 or 編集で1つ目の画像が変更されている)
                var thmbDavModel = new WebDavModel();
                thmbDavModel.set("path", this.model.get("imagePath"));
                thmbDavModel.set("fileName", "thumbnail.png");
                thmbDavModel.set("contentType", "image/png");
                this.makeThmbnail(this.thumbImageByteArray, $.proxy(function(blob){
                    thmbDavModel.set("data", blob);
                    davs.push(thmbDavModel);
                    this.saveDavFile(davs);
                }, this));
            } else {
                this.saveDavFile(davs);
            }
        },
        /**
         * DAVファイルの登録
         */
        saveDavFile : function(davs) {
            var imageCount = davs.length;
            if(imageCount > 0){
                _.each(davs, $.proxy(function(davModel){
                    davModel.save(null, {
                        success : $.proxy(function(e){
                            if(--imageCount <= 0){
                                this.saveModel();
                            }
                        }, this),
                        error: $.proxy(function(e){
                            this.hideLoading();
                            vexDialog.defaultOptions.className = 'vex-theme-default';
                            vexDialog.alert("保存に失敗しました。");
                            app.logger.error("保存に失敗しました。");
                        }, this)
                    });
                }, this));
            } else {
                this.saveModel();
            }
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
                    app.logger.error("保存に失敗しました。");
                }
            });
        }
    });
    module.exports = ArticleRegistConfirmView;
});

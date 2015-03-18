/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
            var dispDescription = CommonUtil.sanitizing(this.model.get("description"));
            if (dispDescription && typeof dispDescription.replace === "function") {
                dispDescription = dispDescription.replace(/\r?\n/g, '<br />');
            }
            $("#articleDescription").html(CommonUtil.replaceURLtoAnchor(dispDescription));

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
                        error: $.proxy(function(model, response, options){
                            this.hideLoading();
                            this.showErrorMessage("記事の写真情報の保存", response);
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
                error: $.proxy(function(model, response, options){
                    this.hideLoading();
                    this.showErrorMessage("記事情報の保存", response);
                }, this)
            });
        }
    });
    module.exports = ArticleRegistConfirmView;
});

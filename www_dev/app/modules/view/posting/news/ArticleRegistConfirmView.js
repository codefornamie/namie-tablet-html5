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
            var dateString = DateUtil.formatDate(new Date(this.model.get("startDate")),"yyyy年MM月dd日(ddd)");
            if(this.model.get("endDate")){
                dateString += " ～ " + DateUtil.formatDate(new Date(this.model.get("endDate")),"yyyy年MM月dd日(ddd)");
            }
            var st = this.model.get("startTime");
            st = st ? st : "";
            var et = this.model.get("endTime");
            et = et ? et : "";
            if(st || et){
                dateString += "\n" + st + " ～ " + et;
            }
            $("#articleDateTime").html(CommonUtil.sanitizing(dateString));
            
            // 掲載期間
            var pubDateString = DateUtil.formatDate(new Date(this.model.get("publishedAt")),"yyyy年MM月dd日(ddd)");
            if(this.model.get("depublishedAt")){
                pubDateString += " ～ " + DateUtil.formatDate(new Date(this.model.get("depublishedAt")) ,"yyyy年MM月dd日(ddd)");
            }
            $("#articlePublishRange").text("掲載期間： " + pubDateString);
            
            $("#articleDescription").html(CommonUtil.sanitizing(this.model.get("description")));
            $("#articleContactInfo").html(CommonUtil.sanitizing(this.model.get("contactInfo")));
            
            var imgs = $("#articleImageArea img");
            var imgIndex = 0;
<<<<<<< Upstream, based on develop
            _.each(this.model.get("images"), function(image){
                $(imgs[imgIndex++]).attr("src", image.src);
=======
            var previewUrlArr = [];
            _.each($("img#previewFile"),function(elem) {
                previewUrlArr.push($(elem).attr("src"));
            });
            _.each(previewUrlArr, function(url){
                $(imgs[imgIndex++]).attr("src", url);
>>>>>>> 97b483b NAM-261
            });
            $("#articleRecommend").text($("#articleRecommendCheck").is(":checked") ? "する":"しない");
        },

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

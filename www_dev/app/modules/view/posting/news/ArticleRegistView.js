define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 記事新規登録画面のViewクラス
     * 
     * @class 記事新規登録画面のViewクラス
     * @exports ArticleRegistView
     * @constructor
     */
    var ArticleRegistView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/articleRegist"),
        /**
         * フォーム要素のID
         */
        formId : '#articleRegistForm',
        /**
         * 画像名
         */
        fileName : '',

        beforeRendered : function() {

        },

        afterRendered : function() {
           
        },

        initialize : function() {
            this.insertView("#fileArea", new ArticleRegistFileItemView());
        },

        events : {
            "click #addFileForm" : "onAddFileForm",
            "click #articleRegistButton" : "onClickArticleRegistButton",
        },
        onAddFileForm: function () {
            this.insertView("#fileArea", new ArticleRegistFileItemView()).render();
        },
        onClickArticleRegistButton : function () {
            if ($(this.formId).validate().form()) {
                this.showLoading();
//                this.onSubmit();
            }
        },
        setInputValue : function () {
        },
        /**
         * 添付された画像をdavへ登録する
         */
        saveArticlePicture : function() {
          var reader = new FileReader();
          var contentType = "";
          reader.onload = $.proxy(function(fileEvent) {
              var options = {
                      body : fileEvent.currentTarget.result,
                      headers : {
                          "Content-Type":contentType,
                          "If-Match":"*"
                      }
              };
              app.box.col("dav").put(this.fileName,options);
          },this);
          // Read in the image file as a data URL.
          var file = $("#articleFile").prop("files")[0];
          contentType = file.type; 
          var preName = file.name.substr(0,file.name.lastIndexOf("."));
          var suffName = file.name.substr(file.name.lastIndexOf("."));
          this.fileName = preName + "_" + String(new Date().getTime()) + suffName; 
          reader.readAsArrayBuffer(file);
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         */
        onSubmit : function() {
            try {
                // 登録処理を開始する
                if ($('#previewFile').attr("src")) {
                    this.saveArticlePicture();
                }
                this.setInputValue();
                var self = this;
                this.model.save(null,{
                    success: function() {
                        setTimeout(function () {
                            self.hideLoading();
                            app.router.go("eventsRegisted");
                        }, 1000);
                    }
                });
            } catch (e) {
                return;
            }
        },

    });
    module.exports = ArticleRegistView;
});

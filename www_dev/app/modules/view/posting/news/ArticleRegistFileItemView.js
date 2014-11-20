define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");


    /**
     * 記事登録画面のファイル登録コンポーネントViewクラス
     * 
     * @class 記事登録画面のファイル登録コンポーネントViewクラス
     * @exports ArticleRegistFileItemView
     * @constructor
     */
    var ArticleRegistFileItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/articleRegistFileItem"),
        /**
         * 画像名
         */
        fileName : '',

        beforeRendered : function() {

        },

        afterRendered : function() {
        },

        initialize : function() {

        },

        events : {
            "change #articleFile" : "onChangeFileData",
            "click #fileInputButton" : "onClickFileInputButton",
            "click #fileDeleteButton" : "onClickFileDeleteButton"
        },
        onClickFileInputButton:function () {
          $(this.el).find("#articleFile")[0].click();  
        },
        onChangeFileData : function (event) {
            var files = event.target.files;// FileList object
            var file = files[0];

            if (!file) {
                $(this.el).find('#previewFile').hide();
                $(this.el).find("#fileDeleteButton").hide();
                return;
            }

          // Only process image files.
          if (!file.type.match('image.*')) {
            return;
          }

          $(this.el).find('#previewFile').attr("src", FileAPIUtil.createObjectURL(file));
          $(this.el).find('#previewFile').show();
          $(this.el).find("#fileDeleteButton").show();
        },
        onClickFileDeleteButton : function () {
            $(this.el).find("#articleFile").val("");
            $(this.el).find("#previewFile").attr("src","");
            $(this.el).find("#previewFile").hide();
            $(this.el).find("#fileDeleteButton").hide();
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

    });
    module.exports = ArticleRegistFileItemView;
});

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
            FileAPIUtil.bindFileInput(this.$el.find("#articleFile"));
            var self = this;

            if (!this.imageUrl) {
                return;
            }
            app.box.col("dav").getBinary(this.imageUrl, {
                success : $.proxy(function(binary) {
                    var arrayBufferView = new Uint8Array(binary);
                    var blob = new Blob([
                        arrayBufferView
                    ], {
                        type : "image/jpg"
                    });
                    var url = FileAPIUtil.createObjectURL(blob);
                    var imgElement = self.$el.find("#previewFile");
                    imgElement.load(function() {
                        window.URL.revokeObjectURL(imgElement.attr("src"));
                    });
                    imgElement.attr("src", url);
                    self.$el.find("#previewFile").show();
                    // 画像の読み込み反映処理の完了タイミングをchangeイベント発火で教える
                    self.$el.find("#previewFile").trigger("change");
                    self.$el.find("#articleFileComent").val(this.imageComment ? this.imageComment : "");
                },this),
                error: $.proxy(function () {
                    alert("画像の取得に失敗しました");
                    this.hideLoading();
                },this)
            });

        },

        initialize : function() {
        },
        events : {
            "change #articleFile" : "onChangeFileData",
            "click #fileInputButton" : "onClickFileInputButton",
            "click #fileDeleteButton" : "onClickFileDeleteButton"
        },
        onClickFileInputButton : function() {
            $(this.el).find("#articleFile")[0].click();
        },
        onChangeFileData : function(event) {
            console.log("onChangeFileData");
            var inputFile = event.target;
            var file = (event.target.files ? event.target.files[0] : event.target.file);
            console.log("onChangeFileData: file: " + file);
            console.log("onChangeFileData: file.type: " + file.type);
            console.log("onChangeFileData: file.name: " + file.name);

            if (!file) {
                $(this.el).find('#previewFile').hide();
                $(this.el).find("#fileDeleteButton").hide();
                return;
            }

            // Only process image files.
            if (!file.type.match('image.*')) {
                return;
            }
          console.log("onChangeFileData");
          var previewImg = $(this.el).find('#previewFile');
          previewImg.prop("file", file);
            var reader = new FileReader();
            reader.onload = (function(img) {
                return function(e) {
                    img.attr("src", e.target.result);
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        inputFile.data = e.target.result;
                    };
                    reader.readAsArrayBuffer(file);
                };
            })(previewImg);
            reader.readAsDataURL(file);
          
          
          $(this.el).find('#previewFile').show();
          $(this.el).find("#fileDeleteButton").show();
        },
        onClickFileDeleteButton : function() {
            $(this.el).find("#articleFile").val("");
            $(this.el).find("#previewFile").attr("src", "");
            $(this.el).find("#previewFile").hide();
            $(this.el).find("#fileDeleteButton").hide();
        },
        setInputValue : function() {
        },
    });
    module.exports = ArticleRegistFileItemView;
});

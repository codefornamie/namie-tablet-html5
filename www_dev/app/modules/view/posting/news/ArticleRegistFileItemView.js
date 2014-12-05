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
                    app.logger.debug("getBinary()");
                    var arrayBufferView = new Uint8Array(binary);
                    var blob = new Blob([
                        arrayBufferView
                    ], {
                        type : "image/jpg"
                    });
                    var url = FileAPIUtil.createObjectURL(blob);
                    var imgElement = self.$el.find("#previewFile");
                    imgElement.load(function() {
                    });
                    imgElement.attr("src", url);
                    self.$el.find("#previewFile").show();
                    self.$el.find("#fileDeleteButton").show();
                    self.$el.find("#previewFile").trigger("change");
                    self.$el.find("#articleFileComent").val(this.imageComment ? this.imageComment : "");
                },this),
                error: $.proxy(function () {
                    alert("画像の取得に失敗しました");
                    app.logger.error("画像の取得に失敗しました");
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
        /**
         * 画像選択ボタン押下時のハンドラ
         */
        onClickFileInputButton : function() {
            $(this.el).find("#articleFile")[0].click();
        },
        /**
         * ファイル選択時のハンドラ
         */
        onChangeFileData : function(event) {
            app.logger.debug("onChangeFileData");
            var inputFile = event.target;
            var file = (event.target.files ? event.target.files[0] : event.target.file);
            app.logger.debug("onChangeFileData: file: " + file);
            app.logger.debug("onChangeFileData: file.type: " + file.type);
            app.logger.debug("onChangeFileData: file.name: " + file.name);

            if (!file) {
                $(this.el).find('#previewFile').hide();
                $(this.el).find("#fileDeleteButton").hide();
                return;
            }

            if (!file.type.match('image.*')) {
                return;
            }
          app.logger.debug("onChangeFileData");
          var previewImg = $(this.el).find('#previewFile');
          previewImg.prop("file", file);
          // ファイルの読み込み
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
        /**
         * 削除ボタン押下時のハンドラ
         */
        onClickFileDeleteButton : function(e) {
            $(this.el).find("#articleFile").val("");
            $(this.el).find("#previewFile").attr("src", "");
            $(this.el).find("#previewFile").hide();
            $(this.el).find("#fileDeleteButton").hide();
            $(this.el).find("#articleFileComent").val("");
        },
        setInputValue : function() {
        },
    });
    module.exports = ArticleRegistFileItemView;
});

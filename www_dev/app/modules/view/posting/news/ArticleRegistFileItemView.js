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
        onClickFileDeleteButton : function() {
            $(this.el).find("#articleFile").val("");
            $(this.el).find("#previewFile").attr("src", "");
            $(this.el).find("#previewFile").hide();
            $(this.el).find("#fileDeleteButton").hide();
        },
        setInputValue : function() {
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
                        "Content-Type" : contentType,
                        "If-Match" : "*"
                    }
                };
                app.box.col("dav").put(this.fileName, options);
            }, this);
            // Read in the image file as a data URL.
            var file = $("#articleFile").prop("files")[0];
            contentType = file.type;
            var preName = file.name.substr(0, file.name.lastIndexOf("."));
            var suffName = file.name.substr(file.name.lastIndexOf("."));
            this.fileName = preName + "_" + String(new Date().getTime()) + suffName;
            reader.readAsArrayBuffer(file);
        },

    });
    module.exports = ArticleRegistFileItemView;
});

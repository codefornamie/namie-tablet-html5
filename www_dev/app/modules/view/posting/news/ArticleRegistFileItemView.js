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
    var WebDavModel = require("modules/model/WebDavModel");
    
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

        /**
         * このビューに表示されている画像のByteArray
         */
        imageByteArray : null,
        /**
         * このビューの表示されている画像に変更があったか
         */
        isChangeImage : false,

        /**
         * ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         * @memberOf ArticleRegistFileItemView#
         */
        beforeRendered : function() {

        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf ArticleRegistFileItemView#
         */
        afterRendered : function() {
            var self = this;
            // エレメントに自分自身を保持する。
            this.$el.data("view", this);
            
            FileAPIUtil.bindFileInput(this.$el.find("#articleFile"));

            if (!this.imageUrl) {
                return;
            }

            // 既に登録されている画像の読み込み
            var davModel = new WebDavModel();
            davModel.id = this.imageUrl;
            davModel.fetch({
                success : $.proxy(function(model, binary) {
                    app.logger.debug("getBinary()");
                    // 取得した画像をBlobURL型に変換
                    self.imageByteArray = new Uint8Array(binary);
                    var blob = new Blob([
                                         this.imageByteArray
                    ], {
                        type : "image/jpg"
                    });
                    var url = FileAPIUtil.createObjectURL(blob);
                    // エレメントに設定
                    var imgElement = self.$el.find("#previewFile");
//                    imgElement.load(function() {
//                      window.URL.revokeObjectURL(imgElement.attr("src"));
//                    });
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

        /**
         * 初期化する
         * @memberOf ArticleRegistFileItemView#
         */
        initialize : function() {
        },

        events : {
            "change #articleFile" : "onChangeFileData",
            "click #fileInputButton" : "onClickFileInputButton",
            "click #fileDeleteButton" : "onClickFileDeleteButton"
        },
        /**
         * 画像選択ボタン押下時のハンドラ
         * @memberOf ArticleRegistFileItemView#
         */
        onClickFileInputButton : function() {
            $(this.el).find("#articleFile")[0].click();
        },
        /**
         * 投稿画面で画像が選択された際に呼び出されるコールバック関数。
         * <p>
         * Google Analytics ログ記録
         * </p>
         * @param event
         */
        fireAnalyticsLogOnChangeFileData: function(event) {
            app.ga.trackEvent("投稿ページ", "写真選択");
        },
        /**
         * ファイル選択時のハンドラ
         * @memberOf ArticleRegistFileItemView#
         */
        onChangeFileData : function(event) {
            this.fireAnalyticsLogOnChangeFileData(event);
            var self = this;
            app.logger.debug("onChangeFileData");
            this.isChangeImage = true;
            var inputFile = event.target;
            var file = (event.target.files ? event.target.files[0] : event.target.file);

            if (!file) {
                // 画像選択画面でキャンセルが押された場合は、元画像を保持したままにする
                return;
            }
            app.logger.debug("onChangeFileData: file: " + file);
            app.logger.debug("onChangeFileData: file.type: " + file.type);
            app.logger.debug("onChangeFileData: file.name: " + file.name);

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
                      var imageDataURL = e.target.result;
                      img.attr("src", imageDataURL);
                      var reader = new FileReader();
                      reader.onload = function(e) {
                          inputFile.data = e.target.result;
                          self.imageByteArray = inputFile.data;
                          self.onLoadFileExtend(e, file, imageDataURL, img);
                      };
                      reader.readAsArrayBuffer(file);
                  };
              })(previewImg);
              reader.readAsDataURL(file);
            this.showImageControl();
        },
        /**
         * 写真選択後、対象写真の削除ボタンやプレビュー画像を表示するための要素を表示する。
         * @memberOf ArticleRegistFileItemView#
         */
        showImageControl: function() {
            $(this.el).find('#previewFile').show();
            $(this.el).find("#fileDeleteButton").show();
        },
        /**
         * 削除ボタン押下時のハンドラ
         * @memberOf ArticleRegistFileItemView#
         */
        onClickFileDeleteButton : function(e) {
            $(this.el).find("#articleFile").val("");
            $(this.el).find("#previewFile").removeProp("file");
            $(this.el).find("#previewFile").attr("src", "");
            $(this.el).find("#previewFile").hide();
            $(this.el).find("#fileDeleteButton").hide();
            $(this.el).find("#articleFileComent").val("");
            this.imageByteArray = null;
        },
        setInputValue : function() {
        },
        /**
         * ファイル読み込み後に行う拡張処理
         * @memberOf ArticleRegistFileItemView#
         * @param {Event} ファイルロードイベント
         */
        onLoadFileExtend : function(ev) {
            
        }
    });
    module.exports = ArticleRegistFileItemView;
});

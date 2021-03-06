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
    var vexDialog = require("vexDialog");
    var async = require("async");

    var WebDavModel = require("modules/model/WebDavModel");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * スライドショー画面一覧アイテムのViewクラス
     * @class スライドショー画面一覧アイテムのViewクラス
     * @exports OpeSlideshowListItemView
     * @constructor
     */
    var OpeSlideshowListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/slideshow/slideshowListItem"),
        /**
         * このViewの親要素
         * @memberOf OpeSlideshowListItemView#
         */
        tagName : "tr",
        /**
         * このViewのイベント
         * @memberOf OpeSlideshowListItemView#
         */
        events : {
            "click [data-article-edit-button]" : "onClickSlideshowDeleteButton"
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlideshowListItemView#
         */
        beforeRendered : function() {
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlideshowListItemView#
         */
        afterRendered : function() {
            this.$(".slideshowImage img").load(function() {
                this.$(".slideshowImage img").addClass("fadeIn");
                this.$(".slideshowImage a").attr("href", this.$(".slideshowImage img").attr("src"));
                this.$(".slideshowImage a").colorbox({
                    photo : true,
                    maxWidth : "83%",
                    maxHeight : "100%",
                });
            }.bind(this));
            this.showPIOImages(".slideshowImage img", [
                {
                    imageUrl : "slideshow/" + this.model.get("filename"),
                    imageIndex : 1
                }
            ]);
        },

        /**
         * 初期化処理
         * @memberOf OpeSlideshowListItemView#
         */
        initialize : function(options) {
        },
        /**
         * スライドショー削除ボタンを押下された際の処理
         * @memberOf OpeSlideshowListItemView#
         */
        onClickSlideshowDeleteButton : function() {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = 'はい';
            vexDialog.buttons.NO.text = 'いいえ';
            vexDialog.open({
                message : 'このスライドショー画像:（' + this.model.get('filename') + ')を削除していいですか？',
                callback : $.proxy(function(value) {
                    if (value) {
                        this.showLoading();
                        this.deleteArticle();
                    }
                    vexDialog.buttons.YES.text = 'OK';
                    return;
                }, this)
            });
        },
        /**
         * スライドショー画像の削除関数 WebDavファイルとODataを物理削除する
         * @memberOf OpeSlideshowListItemView#
         */
        deleteArticle : function() {
            var image = this.model.get("filename");
            var davModel = new WebDavModel();
            davModel.set("path", "slideshow");
            davModel.set("fileName", image);
            this.destroyDavFile(davModel);
        },
        /**
         * DAVファイルの削除
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        destroyDavFile : function(davModel) {
            davModel.destroy({
                success : $.proxy(function() {
                    // ODataの削除
                    this.destroyModel();
                }, this),
                error : $.proxy(function(model, response, options) {
                    this.hideLoading();
                    this.showErrorMessage("スライドショー写真の削除", response);
                }, this)
            });
        },
        /**
         * ODataの削除
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        destroyModel : function() {
            // ODataの削除
            this.model.destroy({
                success : $.proxy(function() {
                    app.logger.debug("destroyModel():success");
                }, this),
                error : $.proxy(function(model, response, options) {
                    this.hideLoading();
                    this.showErrorMessage("スライドショー情報の削除", response);
                }, this)
            });
        }
    });
    module.exports = OpeSlideshowListItemView;
});

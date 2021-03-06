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
    var AbstractView = require("modules/view/AbstractView");
    var WebDavModel = require("modules/model/WebDavModel");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");

    /**
     * 記事詳細画面のViewクラス
     * 
     * @class 記事詳細画面のViewクラス
     * @exports ArticleDetailView
     * @constructor
     */
    var ArticleDetailView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/news/articleDetail"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf ArticleDetailView#
         */
        afterRendered : function() {
            $("#snap-content").scrollTop(0);
            $(".backnumber-scroll-container").scrollTop(0);

            this.showImage();
        },

        /**
         *  Viewを初期化する
         * @memberOf ArticleDetailView#
         */
        initialize : function() {
            console.assert(this.model, 'model is not defined');
        },

        /**
         * このViewが表示している記事に関連する画像データの取得と表示を行う。
         * @memberOf ArticleDetailView#
         */
        showImage: function () {
            var onGetBinary = $.proxy(function(binary,item) {
                var articleImage = $(this.el).find(".eventFileImage img");
                var arrayBufferView = new Uint8Array(binary);
                var blob = new Blob([ arrayBufferView ], {
                    type : "image/jpg"
                });
                var url = FileAPIUtil.createObjectURL(blob);
                $(articleImage[item.imageIndex-1]).load(function() {
//                    $(this).show();
                    window.URL.revokeObjectURL($(this).attr("src"));
                });
                $(articleImage[item.imageIndex-1]).attr("src", url);
                $(articleImage[item.imageIndex-1]).data("blob", blob);
            },this);

            var imgArray = [];
            for (var i=1;i<4;i++) {
                var index = i;
                if (i === 1) {
                    index = "";
                }
                if (this.model.get("imageUrl" + index)) {
                    imgArray.push({
                        imageUrl:this.model.get("imageUrl" + index),
                        imageComment:this.model.get("imageComment" + index),
                        imageIndex:i
                    });
                } else {
                    $($(this.el).find(".eventFileImage img")[i-1]).parent().parent().hide();
                }
            }
            _.each(imgArray,$.proxy(function (item) {
                try {
                    var davModel = new WebDavModel();
                    var path = this.model.get("imagePath");
                    path = path ? path + "/" : "";
                    davModel.id = path + item.imageUrl;
                    davModel.fetch({
                        success : $.proxy(function(model, binary) {
                            onGetBinary(binary,item);
                        },this)
                    });
                } catch (e) {
                    console.error(e);
                }
            },this));
        },

        events : {
            'click [data-goto-edit]': 'onClickGotoEdit',
            'click [data-goto-cancel]': 'onClickGotoCancel',
            'click [data-goto-delete]': 'onClickGotoDelete'
        },

        /**
         *  編集ボタンをクリックしたら呼ばれる
         * @memberOf ArticleDetailView#
         */
        onClickGotoEdit: function () {
            this.showLoading();
            app.router.articleRegist({
                model: this.model
            });
        },

        /**
         * 削除ボタンをクリックしたら呼ばれる
         * @param {Event} ev
         * @memberOf ArticleDetailView#
         */
        onClickGotoDelete : function(ev) {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = 'はい';
            vexDialog.buttons.NO.text = 'いいえ';
            vexDialog.open({
                message : 'この投稿（' + moment(this.model.get('publishedAt')).format('YYYY年MM月DD日') + '配信）を削除していいですか？',
                callback : $.proxy(function(value) {
                    if (value) {
                        this.showLoading();
                        this.deleteArticle();
                    }
                    return;
                }, this)
            });
        },
        /**
         * 写真投稿削除関数
         * @memberOf ArticleDetailView#
         */
        deleteArticle : function() {
            this.model.set("isDelete", true);
            this.model.save(null, {
                success : $.proxy(function() {
                    this.hideLoading();
                    this.model.set("isDeleted", true);
                    app.router.back();
                }, this),
                error : $.proxy(function(model, response, options) {
                    this.hideLoading();
                    this.showErrorMessage("記事の削除", response);
                }, this)
            });
        },
        /**
         *  キャンセルボタンをクリックしたら呼ばれる
         * @memberOf ArticleDetailView#
         */
        onClickGotoCancel: function () {
        }
    });
    module.exports = ArticleDetailView;
});

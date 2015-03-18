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
    var TabletArticleListItemView = require("modules/view/news/ArticleListItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var moment = require("moment");
    var vexDialog = require("vexDialog");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports LetterListItemView
     * @constructor
     */
    var LetterListItemView = TabletArticleListItemView.extend({
        template : require("ldsh!templates/{mode}/letter/top/letterListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberOf LetterListItemView#
         */
        afterRendered : function() {
            if(this.model.get("imageThumbUrl")){
                var davModel = new WebDavModel();
                var path = this.model.get("imagePath");
                path = path ? path + "/" : "";
                davModel.id = path + this.model.get("imageThumbUrl");
                davModel.fetch({
                    success : $.proxy(function(model, binary) {
                        app.logger.debug("getBinary()");
                        var arrayBufferView = new Uint8Array(binary);
                        var blob = new Blob([
                            arrayBufferView
                        ], {
                            type : "image/jpg"
                        });

                        var url = FileAPIUtil.createObjectURL(blob);
                        var imgElement = this.$el.find(".letterListItemPicture");
                        imgElement.load(function() {
                        });
                        imgElement.attr("src", url);
                        // 編集画面の写真表示箇所にも適用
                        $(".letter-edit-form .letterPicture-" + this.model.get('__id')).attr("src", url);
                    },this),
                    error: $.proxy(function () {
                        app.logger.error("画像の取得に失敗しました");
                    },this)
                });
            }
        },

        /**
         *  イベント一覧
         *  @memberOf LetterListItemView#
         */
        events: {
            "click a[data-delete-letter]" : "onClickDeleteLetter"
        },

        /**
         * aタグがクリックされたら呼ばれる
         * @override
         * @memberOf LetterListItemView#
         */
        onClickAnchorTag: function (e) {
            e.preventDefault();
        },

        /**
         * 削除ボタンがクリックされたら呼ばれる
         * @param {Event} ev
         * @memberOf LetterListItemView#
         */
        onClickDeleteLetter: function (ev) {
            ev.preventDefault();

            vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
            vexDialog.buttons.YES.text = 'はい';
            vexDialog.buttons.NO.text = 'いいえ';
            vexDialog.open({
                message : 'この投稿（' + moment(this.model.get('publishedAt')).format('YYYY年MM月DD日') + '配信）を削除していいですか？',
                callback : $.proxy(function(value) {
                    if (value) {
                        app.ga.trackEvent("過去の投稿ページ", "「削除」ボタン押下");
                        this.showLoading();
                        this.deleteLetter();
                    }
                    return;
                },this)
            });
        },
        /**
         * 写真投稿削除関数
         * @memberOf LetterListItemView#
         */
        deleteLetter: function () {
            this.model.set("isDelete", true);
            this.model.save(null, {
                success : $.proxy(function() {
                    this.hideLoading();
                    this.model.set("isDeleted", true);
                }, this),
                error: $.proxy(function(model, response, options){
                    this.hideLoading();
                    this.showErrorMessage("写真投稿の削除", response);
                },this)
            });
        },
    });
    module.exports = LetterListItemView;
});

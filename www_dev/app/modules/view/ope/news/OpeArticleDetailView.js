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
/* global LocalFileSystem */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports OpeArticleDetailView
     * @constructor
     */
    var OpeArticleDetailView = ArticleListItemView.extend({
        /**
         * このViewを表示する際に利用するアニメーション
         * @memberOf OpeArticleDetailView#
         */
        template : require("ldsh!templates/ope/news/articleDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeArticleDetailView#
         * 
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.isMinpoArticle = this.model.isMinpoScraping();
            this.showImage();
            this.afterRenderCommon();
            this.hideLoading();
        },

        /**
         * このViewのイベントを定義する。
         * @memberOf OpeArticleDetailView#
         */
        events : {
            'click [data-goto-edit]': 'onClickGotoEdit',
            'click [data-goto-cancel]' : 'onClickGotoCancel',
            "click a:not(.expansionPicture)" : "onClickAnchorTag"
        },
        /**
         *  編集ボタンをクリックしたら呼ばれる
         * @memberOf ArticleDetailView#
         */
        onClickGotoEdit: function () {
            this.showLoading();
            app.router.opeArticleRegist({
                model : this.model,
                recommendArticle : this.recommendArticle,
                targetDate : this.targetDate
            });
        },

        /**
         * キャンセルボタンをクリックしたら呼ばれる
         * @memberOf OpeArticleDetailView#
         */
        onClickGotoCancel : function() {
            app.router.go("ope-top",this.targetDate);
        }

    });
    module.exports = OpeArticleDetailView;
});

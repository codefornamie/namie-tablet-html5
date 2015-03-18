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
    var ArticleDetailView = require("modules/view/posting/news/ArticleDetailView");

    /**
     * 記事詳細画面のViewクラス
     * 
     * @class 記事詳細画面のViewクラス
     * @exports OpeEventDetailView
     * @constructor
     */
    var OpeEventDetailView = ArticleDetailView.extend({
        /**
         * テンプレートファイル
         * @memberOf OpeEventDetailView#
         */
        template : require("ldsh!templates/{mode}/news/eventDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeEventDetailView#
         */
        afterRendered : function() {
            this.showImage();
            this.hideLoading();
        },
        /**
         * 編集ボタンをクリックしたら呼ばれる
         * @memberOf OpeEventDetailView#
         */
        onClickGotoEdit : function() {
            this.showLoading();
            app.router.opeArticleRegist({
                model : this.model,
                recommendArticle : this.recommendArticle,
                targetDate : this.targetDate,
                backFunction : $.proxy(function() {
                    app.router.opeEventDetail({
                        model : this.model,
                        recommendArticle : this.recommendArticle
                    });
                }, this)
            });
        },
        /**
         * キャンセルボタンをクリックしたら呼ばれる
         * @memberOf OpeEventDetailView#
         */
        onClickGotoCancel : function() {
            app.router.go("ope-top" ,this.targetDate);
        }
    });
    module.exports = OpeEventDetailView;
});

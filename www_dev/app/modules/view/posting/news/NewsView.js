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
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/posting/news/ArticleListView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var IsNull = require("modules/util/filter/IsNull");
    var Equal = require("modules/util/filter/Equal");
    var And = require("modules/util/filter/And");
    var Code = require("modules/util/Code");

    /**
     * 記事一覧・詳細のメインとなる画面のViewクラス
     * 
     * @class 記事一覧・詳細のメインとなる画面のViewクラス
     * @exports NewsView
     * @constructor
     */
    var NewsView = AbstractView.extend({

        template : require("ldsh!templates/{mode}/news/news"),
        articleCollection : new ArticleCollection(),

        beforeRendered : function() {
        },

        afterRendered : function() {
        },

        initialize : function() {
            this.showLoading();
            this.loadArticle();
        },
        /**
         * このViewのイベントを定義する。
         */
        events : {
            "click [data-article-register-button]" : "onClickArticleRegisterButton",
            "click [data-report-register-button]" : "onClickReportRegisterButton",
        },
        /**
         *  articleを読み込む
         */
        loadArticle: function () {
            this.articleCollection.condition.filters = [
                new And([
                        new Equal("type", Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_POSTING]), 
                        new Equal("createUserId", app.user.get("__id")),
                        new IsNull("deletedAt")
                ])
            ];

            this.articleCollection.fetch({
                success: $.proxy(function () {
                    this.onFetch();
                },this),
                
                error: $.proxy(function (model, response, options) {
                    this.showErrorMessage("記事一覧の取得", response);
                    this.hideLoading();
                },this)
            });
        },
        
        /**
         *  全ての情報検索完了後のコールバック関数
         */
        onFetch: function () {

            // ArticleListView初期化
            var articleListView = new ArticleListView();
            articleListView.collection = this.articleCollection;
            this.setView("#article-list", articleListView);
            articleListView.render();
            if (this.articleCollection.size() === 0) {
                $(this.el).find("#article-list").text("記事情報がありません");
            }

            this.hideLoading();
        },
        /**
         *  新規記事投稿ボタン押下時に呼び出されるコールバック関数
         */
        onClickArticleRegisterButton: function () {
            app.router.articleRegist();
        },
        /**
         *  レポート投稿ボタン押下時に呼び出されるコールバック関数
         */
        onClickReportRegisterButton: function () {
            app.router.articleReport();
        },

    });

    module.exports = NewsView;
});

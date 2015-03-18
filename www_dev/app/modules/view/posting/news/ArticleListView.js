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
/* global IScroll:true */

define(function(require, exports, module) {
    "use strict";
    var app = require("app");
    var TabletArticleListView = require("modules/view/news/ArticleListView");
    var ArticleListItemView = require("modules/view/posting/news/ArticleListItemView");

    /**
     * 記事一覧のViewクラス
     * 
     * @class 記事一覧のViewクラス
     * @exports ArticleListView
     * @constructor
     */
    var ArticleListView = TabletArticleListView.extend({
        template : require("ldsh!templates/{mode}/news/articleList"),

        /**
         * 取得した記事一覧を描画する
         */
        setArticleList : function() {
            var currentPage = app.get('currentPage');
            var model = this.collection.at(currentPage);

            this.collection.each(function (model) {
                this.insertView("#articleList", new ArticleListItemView({
                    model : model,
                    template: require("ldsh!templates/{mode}/news/articleListItem")
                }));
            }.bind(this));

        }
    });

    module.exports = ArticleListView;
});

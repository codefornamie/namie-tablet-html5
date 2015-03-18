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
    var TabletArticleListView = require("modules/view/news/ArticleListView");
    var LetterListItemView = require("modules/view/letter/top/LetterListItemView");

    /**
     * 記事一覧のViewクラス
     * 
     * @class 記事一覧のViewクラス
     * @exports LetterListView
     * @constructor
     */
    var LetterListView = TabletArticleListView.extend({
        /**
         * テンプレート
         * @memberOf LetterListView#
         */
        template : require("ldsh!templates/{mode}/top/letterList"),

        /**
         * Layoutがレンダリングされた後に呼ばれる
         * @memberOf LetterListView#
         */
        afterRendered : function() {
            if (this.collection.size() === 0) {
                $(this.el).find(LetterListView.SELECTOR_LETTER_LIST).text("記事情報がありません");
            }
        },

        /**
         * 取得した記事一覧を描画する
         * @override
         * @memberOf LetterListView#
         */
        setArticleList : function() {
            this.setLetterListItemViews();
        },

        /**
         * 取得した記事一覧を元にLetterListItemViewをセットする
         * @memberOf LetterListView#
         */
        setLetterListItemViews : function() {
            this.collection.each(function(model) {
                this.insertView(LetterListView.SELECTOR_LETTER_LIST, new LetterListItemView({
                    model : model,
                    template : require("ldsh!templates/{mode}/top/letterListItem")
                }));
            }.bind(this));
        }
    }, {
        /**
         * リストのセレクタ
         */
        SELECTOR_LETTER_LIST : "#letter-list"
    });

    module.exports = LetterListView;
});
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
    var FeedListItemView = require("modules/view/news/FeedListItemView");

    /**
     * おすすめ記事のViewを作成する。
     * 
     * @class おすすめ記事のView
     * @exports RecommendArticleView
     * @constructor
     */
    var RecommendArticleView = FeedListItemView.extend({
        /**
         * このViewを表示する際に利用するアニメーション
         */
        animation : 'fadeIn',
        /**
         * このViewのテンプレートファイパス
         */
        template : require("ldsh!templates/{mode}/news/recommendArticle"),

        events : {
            "click .feedListItem" : "onClickFeedListItem"
        },

        /**
         * おすすめ記事をクリックされたときのコールバック関数
         * 
         * @param {Event} ev
         */
        onClickFeedListItem : function(ev) {
            app.ga.trackEvent("ニュース", "おすすめ記事参照", this.model.get("title"));

            $(document).trigger('scrollToArticle', {
                articleId : this.model.get("__id")
            });
        }

    });

    module.exports = RecommendArticleView;
});

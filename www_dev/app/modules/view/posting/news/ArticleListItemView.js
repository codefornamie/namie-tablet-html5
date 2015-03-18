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
    var TabletArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports ArticleListItemView
     * @constructor
     */
    var ArticleListItemView = TabletArticleListItemView.extend({
        template : require("ldsh!templates/{mode}/news/articleListItem"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
//            this.showImage();
            if(this.model.get("parent")){
                this.$el.find("#articleEditButton").text("レポート詳細");
                this.$el.find("#articleReportButton").hide();
            }
        },

        /**
         * このViewのイベントを定義する。
         */
        events : {
            "click a" : "onClickAnchorTag",
            "click [data-goto-detail]" : "onClickGotoDetail",
            "click [data-goto-report]" : "onClickGotoReport"
        },

        /**
         * イベント詳細ボタンをクリックされたときのコールバック関数
         *
         *  @param {Event} ev
         */
        onClickGotoDetail : function(ev) {
            var model = this.model;

            app.router.articleDetail({
                model: model
            });
        },

        /**
         * レポートを書くボタンを押下された際のハンドラ
         */
        onClickGotoReport : function(e){
            app.router.articleRegist({parentModel: this.model, articleCategory: "4"});
        }
    });
    module.exports = ArticleListItemView;
});

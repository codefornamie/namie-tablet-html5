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
    var OpeYouTubeRegistConfirmView = require("modules/view/ope/news/OpeYouTubeRegistConfirmView");
    var vexDialog = require("vexDialog");

    /**
     * YouTube詳細画面のViewクラス
     * 
     * @class YouTube詳細画面のViewクラス
     * @exports OpeYouTubeDetailView
     * @constructor
     */
    var OpeYouTubeDetailView = OpeYouTubeRegistConfirmView.extend({
        template : require("ldsh!templates/ope/news/youtubeDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeYouTubeDetailView#
         * 
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.showImage();
            $("#articleRecommend").text(this.model.get("isRecommend") ? "する" : "しない");
            this.hideLoading();
        },
        events : {
            'click [data-goto-edit]' : 'onClickGotoEdit',
            'click [data-goto-cancel]' : 'onClickGotoCancel',
        },
        /**
         * 編集ボタンをクリックしたら呼ばれる
         * @memberOf OpeYouTubeDetailView#
         */
        onClickGotoEdit : function() {
            this.showLoading();
            app.router.opeYouTubeRegist({
                model : this.model,
                recommendArticle : this.recommendArticle,
                backFunction : $.proxy(function() {
                    app.router.opeYouTubeDetail({
                        model : this.model,
                        recommendArticle : this.recommendArticle
                    });
                }, this)
            });
        },
        /**
         * キャンセルボタンをクリックしたら呼ばれる
         * @memberOf OpeYouTubeDetailView#
         */
        onClickGotoCancel : function() {
            app.router.go("ope-top" ,this.targetDate);
        }

    });
    module.exports = OpeYouTubeDetailView;
});

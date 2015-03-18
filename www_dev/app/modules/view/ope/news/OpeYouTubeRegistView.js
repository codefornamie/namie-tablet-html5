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
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");
    var OpeYouTubeRegistConfirmView = require("modules/view/ope/news/OpeYouTubeRegistConfirmView");

    /**
     * YouTube編集画面のViewクラス
     * 
     * @class YouTube編集画面のViewクラス
     * @exports OpeYouTubeRegistView
     * @constructor
     */
    var OpeYouTubeRegistView = YouTubeListItemView.extend({
        template : require("ldsh!templates/ope/news/youtubeRegist"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.showImage();
            $("#articleTitle").val(this.model.get("title"));
            $("#articleDetail").val(this.model.get("description"));
            if (this.model.get("isRecommend")) {
                $("#articleRecommendCheck").attr("checked", "checked");
            }
            this.hideLoading();
        },
        events : {
            "click #articleConfirmButton" : "onArticleConfirmButton",
            "click #articleCancelButton" : "onClickArticleCancelButton"
        },
        /**
         * 確認画面へボタンが押下された際のコールバック関数
         */
        onArticleConfirmButton : function() {
            this.setInputValue();
            $("#youtubeRegistPage").hide();
            this.setView("#articleRegistConfirmWrapperPage", new OpeYouTubeRegistConfirmView({
                model : this.model,
                recommendArticle : this.recommendArticle,
                publishedAt : this.model.get("publishedAt")
            })).render();
            $("#snap-content").scrollTop(0);
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         */
        onClickArticleCancelButton : function() {
            if (this.backFunction) {
                this.backFunction();
            } else {
                app.router.go("ope-top", this.targetDate);
            }
        },
        setInputValue : function() {
            this.model.set("title", $("#articleTitle").val());
            this.model.set("description", $("#articleDetail").val());
            this.model.set("isRecommend", $("#articleRecommendCheck").is(":checked") ? "true" : null);
        }

    });
    module.exports = OpeYouTubeRegistView;
});

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
    var vexDialog = require("vexDialog");

    /**
     * YouTube編集確認画面のViewクラス
     * 
     * @class YouTube編集確認画面のViewクラス
     * @exports OpeYouTubeRegistConfirmView
     * @constructor
     */
    var OpeYouTubeRegistConfirmView = YouTubeListItemView.extend({
        template : require("ldsh!templates/ope/news/youtubeRegistConfirm"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            // TODO データ読み込み終わったら以下を実行
            this.showImage();
            $("#articleRecommend").text($("#articleRecommendCheck").is(":checked") ? "する":"しない");
            this.hideLoading();
        },
        events : {
            "click #articleBackButton" : "onClickArticleBackButton",
            "click #articleRegistButton" : "onClickArticleRegistButton"
        },
        /**
         * 戻るボタンが押下された際のコールバック関数
         */
        onClickArticleBackButton : function() {
            this.$el.remove();
            $("#youtubeRegistPage").show();
            $("#snap-content").scrollTop(0);
        },
        /**
         * 登録するボタンが押下された際のコールバック関数
         */
        onClickArticleRegistButton : function() {
            this.showLoading();
            this.saveModel();
        },
        saveModel : function() {
            this.model.save(null, {
                success : $.proxy(function() {
                    if (this.model.get("isRecommend") && this.recommendArticle &&
                            this.recommendArticle.get("__id") !== this.model.get("__id")) {
                        this.recommendArticle.set("isRecommend",null);
                        this.recommendArticle.save(null, {
                            success:$.proxy(function() {
                                app.router.go("ope-top" ,this.publishedAt);
                            },this),
                            error:$.proxy(function() {
                                app.router.go("ope-top" ,this.publishedAt);
                            },this)
                        });
                    }else {
                        app.router.go("ope-top" ,this.publishedAt);
                    }
                }, this),
                error : function(model, resp, options) {
                    this.hideLoading();
                    this.showErrorMessage("記事情報の編集", resp);
                }.bind(this)
            });
        },
        /**
         * YouTube動画プレイヤーの設定を行う。
         */
        setYouTubePlayer : function() {
            this.waitReadyYoutube($.proxy(function() {
                this.player = new YT.Player('youtubePlayer', {
                    width : '640',
                    height : '390',
                    playerVars : {
                        'autoplay' : 0,
                        'controls' : 1
                    },
                    events : {
                        "onReady" : $.proxy(this.onSetYouTubePlayer, this)
                    }
                });
            }, this));
        },
    });
    module.exports = OpeYouTubeRegistConfirmView;
});

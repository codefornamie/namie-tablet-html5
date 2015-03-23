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
    var TagListView = require("modules/view/news/TagListView");
    var vexDialog = require("vexDialog");
    var moment = require("moment");

    /**
     * 運用管理ツールの記事一覧テーブルの記事レコードのViewを作成する。
     * 
     * @class 運用管理ツールの記事一覧テーブルの記事レコードのView
     * @exports OpeFeedListItemView
     * @constructor
     */
    var OpeFeedListItemView = FeedListItemView.extend({
        /**
         * このViewの親要素
         * @memberOf OpeFeedListItemView#
         */
        tagName : "tr",
        /**
         * このViewを表示する際に利用するアニメーション
         * @memberOf OpeFeedListItemView#
         */
        animation : null,
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeFeedListItemView#
         * 
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            if (this.model.get("isRecommend") && (this.model.get("publishedAt") === this.parentView.targetDate)) {
                // 今日のおすすめ記事フラグがある場合はラジオボタンを選択状態にする
                this.$el.find("input[type='radio']").attr("checked", "checked");
            }
            this.setData();
        },
        /**
         * このViewのイベントを定義する。
         * @memberOf OpeFeedListItemView#
         */
        events : {
            "click [data-article-edit-button]" : "onClickArticleEditButton",
            "change .isPublishCheckBox" : "onChangeIsPublishCheckBox",
            "change .today-recommend-radio" : "onChangeTodayRecommendRadio",
            "click .today-recommend-radio" : "onClickTodayRecommendRadio",
            "click .ope-title-anchor" : "onClickOpeTitleAnchor"
        },
        /**
         * モデルから画面項目への設定。
         * @memberOf OpeFeedListItemView#
         */
        setData : function() {
            this.lastModel = this.model;
            this.$el.find(".isPublishCheckBox").prop("checked", !this.model.get("isDepublish"));
        },
        /**
         * 保存の開始
         * @memberOf OpeFeedListItemView#
         */
        saveStart : function() {
            this.$el.find(".isPublishCheckBox").prop("disabled", true);
            this.$el.find("[data-article-edit-button]").prop("disabled", true);
        },
        /**
         * 保存の終了
         * @memberOf OpeFeedListItemView#
         * @param {Boolean} 保存に成功したかどうか
         */
        saveEnd : function(resp) {
            if (resp) {
                this.model = this.lastModel;
                this.showMessage("配信情報の保存に失敗しました", resp.event, app.PIOLogLevel.ERROR);
                // 一覧を再読み込み
                this.parentView.parent.reloadNewsView();
                return;
            }
            this.lastModel = this.model;
            this.setData();
            this.$el.find(".isPublishCheckBox").prop("disabled", false);
            this.$el.find("[data-article-edit-button]").prop("disabled", false);
        },
        /**
         * 配信有無チェックボックスが変更された際のハンドラ
         * @memberOf OpeFeedListItemView#
         * @param {Event} イベント
         */
        onChangeIsPublishCheckBox : function(e) {
            this.save();
        },
        /**
         * 画面項目からモデルへの設定。
         * @memberOf OpeFeedListItemView#
         */
        setInputValue : function() {
            this.model.set("isDepublish", this.$el.find(".isPublishCheckBox").prop('checked') ? null : "true");
        },
        /**
         * 編集ボタン押下時に呼び出されるコールバック関数
         * @memberOf OpeFeedListItemView#
         */
        onClickArticleEditButton : function() {
            this.showLoading();
            $("[data-sequence-register-button]").hide();
            $("#sequenceConfirm").hide();
            // TODO デプロイ時にYouTube編集が開けない問題の暫定対処
//            if (this.model.get("type") === "2") {
//                app.router.opeYouTubeRegist({
//                    model : this.model,
//                    recommendArticle : this.parentView.recommendArticle,
//                    targetDate : this.parentView.targetDate
//                });
//            } else {
                app.router.opeArticleRegist({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle,
                    targetDate : this.parentView.targetDate
                });
//            }
            $("#contents__primary").scrollTop(0);
        },
        /**
         * タイトル押下時に呼び出されるコールバック関数
         * @memberOf OpeFeedListItemView#
         */
        onClickOpeTitleAnchor : function() {
            this.showLoading();
            $("[data-sequence-register-button]").hide();
            $("#sequenceConfirm").hide();
            switch (this.model.get("type")) {
            case "1":
            case "7":
            case "8":
                var template = require("ldsh!templates/{mode}/news/articleDetail");

                if (this.model.get("rawHTML")) {
                    template = require("ldsh!templates/{mode}/news/articleDetailForHtml");
                }
                app.router.opeArticleDetail({
                    model : this.model,
                    template : template,
                    recommendArticle : this.parentView.recommendArticle,
                    targetDate : this.parentView.targetDate
                });
                break;
                // TODO デプロイ時にYouTube編集が開けない問題の暫定対処
//            case "2":
//                app.router.opeYouTubeDetail({
//                    model : this.model,
//                    recommendArticle : this.parentView.recommendArticle,
//                    targetDate : this.parentView.targetDate
//                });
//                break;
            case "3":
            case "4":
            case "5":
                app.router.opeEventDetail({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle,
                    targetDate : this.parentView.targetDate
                });
                break;
            default:
                app.router.opeEventDetail({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle,
                    targetDate : this.parentView.targetDate
                });
                break;
            }
            $("#contents__primary").scrollTop(0);
        },
        /**
         * 画面データ保存
         * @memberOf OpeFeedListItemView#
         */
        save : function() {
            this.setInputValue();
            this.saveStart();
            this.model.save(null, {
                success : $.proxy(function() {
                    this.model.fetch({
                        success : $.proxy(function() {
                            this.saveEnd();
                        }, this),
                        error : $.proxy(function(resp) {
                            this.saveEnd(resp);
                        }, this)
                    });
                }, this),
                error : $.proxy(function(model, resp) {
                    this.saveEnd(resp);
                }, this)
            });
        },
        /**
         * おすすめ記事のラジオボタンがクリックされた際のコールバック関数
         * @memberOf OpeFeedListItemView#
         */
        onClickTodayRecommendRadio : function(ev) {
            if (this.model.get("publishedAt") !== this.parentView.targetDate) {
                ev.preventDefault();
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("記事の配信開始日のみ、おすすめの設定が可能です。<br>当該記事配信開始日：" +
                        moment(this.model.get("publishedAt")).format("YYYY年MM月DD日"));
            }
        },
        /**
         * おすすめ記事のラジオボタンが変更された際のコールバック関数
         * @memberOf OpeFeedListItemView#
         */
        onChangeTodayRecommendRadio : function() {
            this.showLoading();
            this.model.set("isRecommend", "true");
            this.model.save(null, {
                success : $.proxy(this.onRecommendSave, this),
                error : $.proxy(function(model, resp, options) {
                    if (resp.event && resp.event.isConflict()) {
                        this.showMessage("他のユーザーとおすすめ記事情報の保存操作が競合したため、保存できませんでした。<br/>再度、保存操作を行ってください。", resp.event);
                    } else {
                        this.showMessage("おすすめ記事情報の保存に失敗しました", resp.event, app.PIOLogLevel.ERROR);
                    }
                    this.hideLoading();
                    // 一覧を再読み込み
                    this.parentView.parent.reloadNewsView();
                }, this)
            });
        },
        /**
         * おすすめ記事情報保存後のコールバック関数
         * @memberOf OpeFeedListItemView#
         */
        onRecommendSave : function() {
            this.model.fetch({
                success : $.proxy(function() {
                    $(this.el).find("input[type='radio']").trigger("onRecommendFetch", [
                        this.model
                    ]);
                }, this),
                error : $.proxy(function(resp) {
                    this.showMessage("おすすめ記事情報の保存に失敗しました", resp.event, app.PIOLogLevel.ERROR);
                    this.hideLoading();
                }, this)
            });
        }

    });

    module.exports = OpeFeedListItemView;
});

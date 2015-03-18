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
    var colorbox = require("colorbox");
    var vexDialog = require("vexDialog");
    
    var DateUtil = require("modules/util/DateUtil");
    var NewsView = require("modules/view/news/NewsView");
    var OpeFeedListView = require("modules/view/ope/news/OpeFeedListView");
    var OpeFeedListItemView = require("modules/view/ope/news/OpeFeedListItemView");
    var OpeNewsPreviewView = require("modules/view/ope/news/OpeNewsPreviewView");

    var NewspaperHolidayCollection = require("modules/collection/misc/NewspaperHolidayCollection");

    var And = require("modules/util/filter/And");
    var Equal = require("modules/util/filter/Equal");
    var IsNull = require("modules/util/filter/IsNull");
    var Or = require("modules/util/filter/Or");

    /**
     * 運用管理アプリの記事一覧画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリの記事一覧画面を表示するためのView
     * @exports OpeNewsView
     * @constructor
     */
    var OpeNewsView = NewsView.extend({
        /**
         * 記事一覧を表示する要素のセレクタ
         * @memberOf OpeNewsView#
         */
        feedListElement : '#article_list',
        /**
         * このViewのイベント
         * @memberOf OpeNewsView#
         */
        events : {
            "click [data-article-register-button]" : "onClickArticleRegisterButton",
            "click [data-article-preview-button]" : "onClickArticlePreviewButton",
            "click [ope-preview-back-button]" : "onClickOpePreviewBackButton"
        },
        
        /**
         * ビューの初期化を行う。
         * @memberOf OpeNewsView#
         * @param {Object} options ビューのオプション
         */
        initialize : function(options) {
            options = options || {};

            this.targetDate = this.targetDate || options.date;

            this.initEvents();
        },

        /**
         * 表示する日付を設定する。
         * @memberOf OpeNewsView#
         * @param {Date} targetDate 表示する日付。
         */
        setDate : function(targetDate) {
            this.closePreview();
            // 変更される前のtargetDateを保存する
            this.prevSelectedTargetDate = this.targetDate;

            // 休刊日情報の読み込み
            var holCol = new NewspaperHolidayCollection();
            holCol.prevPublished(targetDate, function(prev, isPublish, e) {
                if (e) {
                    this.showErrorMessage("休刊日情報の取得", e);
                    this.hideLoading();
                    return;
                }
                // 休刊日かどうか
                if (isPublish) {
                    // 発刊日の場合
                    this.targetDate = moment(targetDate).format("YYYY-MM-DD");
                    this.$el.find("#targetDate").text(
                            DateUtil.formatDate(targetDate, "yyyy年MM月dd日") + app.serverConfig.PUBLISH_TIME);
                    // 記事読み込み範囲設定
                    this.setArticleSearchCondition(moment(prev).add(1, "d").toDate(), new Date(targetDate));
                    // 記事読み込み   
                    this.searchArticles();
                } else {
                    // 休刊日の場合
                    // 前に選択していた日付に戻す。
                    this.targetDate = this.prevSelectedTargetDate;
                    // 休刊日
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("休刊日です。");
                    $("[data-date]").removeClass("current");
                    this.hideLoading();
                }
            }.bind(this));
        },
        
        /**
         * 記事の検索条件を指定する。
         * @param {Date} from 検索条件範囲の開始
         * @param {Date} to 検索条件範囲の終了
         * @memberOf OpeNewsView#
         */
        setArticleSearchCondition : function(from, to) {
            this.articleCollection.setSearchConditionRange(from, to, false, true);
        },
        /**
         * 左ペインの記事一覧メニューを表示する。
         * @memberOf OpeNewsView#
         */
        showArticleListView : function() {
            return;
        },
        /**
         * 右ペインの記事一覧を表示するViewのインスタンスを作成して返す。
         * <p>
         * 運用管理ツール用の記事一覧表示処理を行うため、OpeFeedListViewの
         * インスタンスを生成するようにオーバライドする。
         * </p>
         * @return {OpeFeedListView} 生成したOpeFeedListViewのインスタンス
         * @memberOf OpeNewsView#
         */
        createGridListView: function() {
            return this.createFeedListView();
        },
        /**
         * 記事一覧を表示するViewのインスタンスを作成して返す。
         * @return {FeedListView} 生成したFeedListViewのインスタンス
         * @memberOf OpeNewsView#
         */
        createFeedListView : function() {
            if (this.notFoundMessage) {
                this.notFoundMessage.hide("slow");
            }
            var listView = new OpeFeedListView();
            listView.targetDate = this.targetDate;
            listView.setFeedListItemViewClass(OpeFeedListItemView);
            listView.parent = this;
            return listView;
        },
        /**
         * 記事が見つからなかった場合のメッセージを画面に表示する。
         * @memberOf OpeNewsView#
         */
        showFeetNotFoundMessage : function() {
            this.notFoundMessage = $('<div data-alert class="alert-box info radius">指定された日付には記事がありません。</div>').insertBefore(
                    $(this.el).find("#feedList").parent());
        },
        /**
         *  新規記事投稿ボタン押下時に呼び出されるコールバック関数
         *  @memberOf OpeNewsView#
         */
        onClickArticleRegisterButton: function () {
            $("[data-sequence-register-button]").hide();
            $("#sequenceConfirm").hide();
            app.router.opeArticleRegist({targetDate : this.targetDate});
        },
        /**
         *  プレビュー表示ボタン押下時に呼び出されるコールバック関数
         *  @memberOf OpeNewsView#
         */
        onClickArticlePreviewButton: function () {
            $("#opeNewsHolder").hide();
            this.setView("#article_list_preview", new OpeNewsPreviewView({targetDate: this.targetDate})).render();
            $("#opePreviewHolder").show();
            $("#contents__primary").scrollTop(0);
        },
        /**
         *  戻るボタン押下時に呼び出されるコールバック関数
         *  @memberOf OpeNewsView#
         */
        onClickOpePreviewBackButton: function () {
            this.reloadNewsView();
        },
        /**
         * 記事一覧を再読み込みする
         */
        reloadNewsView: function() {
            this.setDate(new Date(this.targetDate));
        },
        /**
         *  プレビュー表示を閉じる
         *  @memberOf OpeNewsView#
         */
        closePreview: function () {
            $("#opePreviewHolder").hide();
            $("#article_list_preview").empty();
            $("#opeNewsHolder").show();
            $("#contents__primary").scrollTop(0);
        }
    });

    module.exports = OpeNewsView;
});

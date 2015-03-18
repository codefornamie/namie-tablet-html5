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
    var BacknumberDateNewsView = require("modules/view/backnumber/BacknumberDateNewsView");
    var BusinessUtil = require("modules/util/BusinessUtil");
    var DateUtil = require("modules/util/DateUtil");

    /**
     *  バックナンバーページで見る各日付の記事のView
     *
     *  @class バックナンバーページで見る各日付の記事のViewクラス
     *  @exports BacknumberDateView
     *  @constructor
     */
    var BacknumberDateView = AbstractView.extend({
        /**
         *  テンプレートファイル
         * @memberOf BacknumberDateView#
         */
        template : require("ldsh!templates/{mode}/backnumber/backnumberDate"),
        date : null,
        newsView: null,

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         * @memberOf BacknumberDateView#
         */
        beforeRendered : function() {
            this.showNewsView();
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf BacknumberDateView#
         */
        afterRendered : function() {
            app.ga.trackPageView("BackNoList","バックナンバー記事一覧ページ");

            this.updateDateLabel();
        },

        /**
         *  初期化処理
         * @param {Object} options 初期化処理オブション情報
         * @memberOf BacknumberDateView#
         */
        initialize : function(options) {
            console.assert(options && options.date, 'Please pass the date value');

            options = options || {};

            var date = options.date;

            if (!(date instanceof Date)) {
                date = Date.parse(date);
            }
            if (!date) {
                date = new Date();
            }

            this.date = date;

            // 最終配信日より後の日付を指定された場合は、最終配信日に移動する
            var currentPublishDate = BusinessUtil.getCurrentPublishDate();
            if (DateUtil.formatDate(this.date, "yyyy-MM-dd") > DateUtil.formatDate(currentPublishDate, "yyyy-MM-dd")) {
                this.date = currentPublishDate;
                app.router.navigate("backnumber/" + DateUtil.formatDate(this.date, "yyyy-MM-dd"), {
                    trigger: true,
                    replace: false
                });
            }

            $("#main").addClass("is-backnumber-date");
        },

        events : {
            'click [data-backnumber-list]': 'onClickBackToList',
            'click [data-backnumber-day-prev]': 'onClickDayPrev',
            'click [data-backnumber-day-next]': 'onClickDayNext'
        },

        /**
         *  一覧から探すボタンを押したら呼ばれる
         *  @param {Event} evt クリックイベント
         * @memberOf BacknumberDateView#
         */
        onClickBackToList : function(evt) {
            app.router.go("backnumber");
            evt.preventDefault();
        },

        /**
         *  前の日へ戻るボタンを押したら呼ばれる
         *  @param {Event} evt クリックイベント
         * @memberOf BacknumberDateView#
         */
        onClickDayPrev : function(evt) {
            var dateParam = DateUtil.formatDate(DateUtil.addDay(this.date, -1), "yyyy-MM-dd");
            app.router.navigate("backnumber/" + dateParam, {
                trigger: true,
                replace: false
            });
        },

        /**
         *  次の日へ進むボタンを押したら呼ばれる
         *  @param {Event} evt クリックイベント
         * @memberOf BacknumberDateView#
         */
        onClickDayNext : function(evt) {
            var dateParam = DateUtil.formatDate(DateUtil.addDay(this.date, 1), "yyyy-MM-dd");
            app.router.navigate("backnumber/" + dateParam, {
                trigger: true,
                replace: false
            });
        },

        /**
         *  記事一覧画面を表示する
         * @memberOf BacknumberDateView#
         */
        showNewsView : function() {
            console.assert(this.date, 'date shoud be specified');

            this.newsView = new BacknumberDateNewsView({
                date: this.date
            });
            this.setView('#backnumber-news', this.newsView);
        },

        /**
         *  日付の表示を更新する
         * @memberOf BacknumberDateView#
         */
        updateDateLabel : function() {
            $(".backnumber-nav__month .date--year").html(DateUtil.formatDate(this.date, "yyyy"));
            $(".backnumber-nav__month .date--month").html(DateUtil.formatDate(this.date, "MM"));
            $(".backnumber-nav__month .date--day").html(DateUtil.formatDate(this.date, "dd"));
            $(".backnumber-nav__month .date--weekday").html(DateUtil.formatDate(this.date, "ddd"));

            // 最新配信日の場合は「次の日」を非表示にする
            if (DateUtil.formatDate(this.date, "yyyy-MM-dd") == DateUtil.formatDate(BusinessUtil.getCurrentPublishDate(), "yyyy-MM-dd")) {
                $("[data-backnumber-day-next]").css("visibility", "hidden");
            }
        },

        /**
         * ビューが破棄される時に呼ばれる
         * @memberOf BacknumberDateView#
         */
        cleanup: function () {
            $("#main").removeClass("is-backnumber-date");
        },
    });
    module.exports = BacknumberDateView;
});

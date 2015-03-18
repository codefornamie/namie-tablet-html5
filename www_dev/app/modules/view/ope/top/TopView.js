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
    var OpeNewsView = require("modules/view/ope/news/OpeNewsView");
    var foundationCalendar = require("foundation-calendar");

    /**
     * 運用管理アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/top"),
        newsView : null,
        targetDate : null,

        /**
         * このViewのイベント
         * @memberOf TopView#
         */
        events : {
            "click [data-news-list-button]" : "onClickNewsListButton",
            "click [data-slideshow-list-button]" : "onClickSlideshowListButton"
        },
        /**
         * 描画前に実行する処理。
         * @memberOf TopView#
         */
        beforeRendered : function() {
            this.$el.foundation();
        },

        /**
         * 描画後に実行する処理。
         * @memberOf TopView#
         */
        afterRendered : function() {
            var self = this;
            // カレンダー表示
            var calendar = this.$el.find("[data-date]");
            var targetDate;
            if (this.targetDate) {
                targetDate = this.targetDate;
            } else {
                var date = new Date();
                targetDate = date.format("%Y-%m-%d");
            }
            this.newsView = new OpeNewsView({targetDate:targetDate});
            calendar.val(targetDate);
            calendar.fcdp({
                fixed : true,
                dateSelector : true,
            });
            calendar.bind('dateChange', function(evt, opts) {
                console.info('dateChange triggered');
                var targetDate = new Date(evt.target.value);
                self.newsView.setDate(targetDate);

                targetDate = targetDate.format("%Y-%m-%d");
                self.targetDate = targetDate;
            });

            // 記事一覧を表示
            this.setView("#opeNewsList", this.newsView).render();
            this.newsView.setDate(this.targetDate ? new Date(this.targetDate) : new Date());
            $("[data-sequence-register-button]").show();
        },
        /**
         * 新聞記事一覧ボタンを押下された際の処理
         * @memberOf TopView#
         */
        onClickNewsListButton : function() {
            var date = this.targetDate || null;
            app.router.go("ope-top", date);
        },
        /**
         * スライドショー画像一覧ボタンを押下された際の処理
         * @memberOf TopView#
         */
        onClickSlideshowListButton : function() {
            $("[data-sequence-register-button]").hide();
            app.router.go("ope-slideshow");
        }
    });

    module.exports = TopView;
});

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
    var Code =require("modules/util/Code");

    /**
     * コンストラクタ。
     * @memberOf AnalyticsUtil#
     */
    var AnalyticsUtil = function() {
        this.ga = null;
    };

    /**
     * 初期化。
     * @memberOf AnalyticsUtil#
     */
    AnalyticsUtil.initialize = function(app) {
        this.ga = window.ga_storage;
        this.ga._setAccount(app.config.googleAnalytics.trackingId);
        this.app = app;
    };

    /** 
     * ページビュートラッキング。
     * @param {String} path ページのパス（例: "/top"）
     * @param {String} title ページタイトル（例: "TOPページ"）
     * @memberOf AnalyticsUtil#
     */
    AnalyticsUtil.trackPageView = function(path, title) {
        // AnalyticsのPath情報を、mode/path (ex. news/Login) に変換する
        path = this.app.config.basic.mode + "/" + path;
        // titleにアプリ名をつける
        title = Code.APP_NAME[this.app.config.basic.mode] + "/" + title;

        this.ga._trackPageview(path, title);
        if (this.app.logger) {
            // アプリログを記録する
            this.app.logger.info("Page was opened. [path=" + path + ", title=" + title + "]");
        }
    };

    /**
     * イベントトラッキング。
     * @param {String} category イベントの分類
     * @param {String} action 具体的な操作の名称
     * @param {String} label イベントを区別するラベル（省略可）
     * @param {String} value イベントの数値データ（省略可）
     * @memberOf AnalyticsUtil#
     */
    AnalyticsUtil.trackEvent = function(category, action, label, value) {
        category = Code.APP_NAME[this.app.config.basic.mode] + "/" + category;
        this.ga._trackEvent(category, action, label, value);
        if (this.app.logger) {
            // アプリログを記録する
            this.app.logger.info("Event was occured. [category=" + category + ", action=" + action + ", label=" +
                    label + ", value=" + value + "]");
        }
    };

    module.exports = AnalyticsUtil;
});

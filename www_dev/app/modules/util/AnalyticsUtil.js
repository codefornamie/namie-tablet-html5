define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var AnalyticsUtil = function() {
        this.ga = null;
    };

    /**
     * 初期化。
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
     */
    AnalyticsUtil.trackPageView = function(path, title) {
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
     */
    AnalyticsUtil.trackEvent = function(category, action, label, value) {
        this.ga._trackEvent(category, action, label, value);
        if (this.app.logger) {
            // アプリログを記録する
            this.app.logger.info("Event was occured. [category=" + category + ", action=" + action + ", label=" +
                    label + ", value=" + value + "]");
        }
    };

    module.exports = AnalyticsUtil;
});

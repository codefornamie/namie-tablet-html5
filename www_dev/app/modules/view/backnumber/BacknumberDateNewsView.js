define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var NewsView = require("modules/view/news/NewsView");

    /**
     * バックナンバー機能での記事一覧・詳細のメインとなる画面のViewクラスを作成する。
     * @class バックナンバー機能での記事一覧・詳細のメインとなる画面のViewクラス
     * @exports BacknumberDateNewsView
     * @constructor
     */
    var BacknumberDateNewsView = NewsView.extend({
        /**
         * Google Analyticsでページビューを記録する
         * @memberOf BacknumberDateNewsView#
         */
        trackPageView : function() {
            app.ga.trackPageView("/BacknumberDateNewsView", "バックナンバーニュース");
        }
    });

    module.exports = BacknumberDateNewsView;
});

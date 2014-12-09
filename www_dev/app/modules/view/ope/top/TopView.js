define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var OpeNewsView = require("modules/view/ope/news/OpeNewsView");
    var foundationCalendar = require("foundation-calendar");
    var DateUtil = require("modules/util/DateUtil");

    /**
     * 運用管理アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/top"),

        /**
         * 描画前に実行する処理。
         * @memberof TopView#
         */
        beforeRendered : function() {
            this.$el.foundation();
        },

        /**
         * 描画後に実行する処理。
         * @memberof TopView#
         */
        afterRendered : function() {
            var newsView = new OpeNewsView();
            // カレンダー表示
            var calendar = this.$el.find("[data-date]");
            calendar.fcdp({
                fixed : true,
                dateSelector : true
            });
            calendar.bind('dateChange', function(evt, opts) {
                console.info('dateChange triggered');
                var targetDate = new Date(evt.target.value);
                newsView.setDate(targetDate);
            });

            // 記事一覧を表示
            this.setView("#opeNewsList", newsView).render();
            newsView.setDate(new Date());
        },
    });

    module.exports = TopView;
});

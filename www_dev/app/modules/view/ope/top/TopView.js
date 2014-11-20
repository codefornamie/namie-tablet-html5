define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var foundationCalendar = require("foundation-calendar");
    var jquerySortable = require("jquery-sortable");

    /**
     * 運用管理アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/top"),

        beforeRendered : function() {
            this.$el.foundation();
        },

        afterRendered : function() {
            var calendar = this.$el.find("[data-date]");
            calendar.fcdp({
                fixed : true,
                dateSelector : true
            });
            $('.sortable').sortable({
                items : 'tr',
                forcePlaceholderSize: true,
                handle: '.handle'
            });
        },
    });

    module.exports = TopView;
});

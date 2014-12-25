define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var foundationCalendar = require("foundation-calendar");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * @class
     * @exports ModalCalendarView
     * @constructor
     */
    var ModalCalendarView = AbstractView.extend({
        /**
         * テンプレート
         * @memberof ModalCalendarView#
         */
        template : require("ldsh!templates/news/common/modal-calendar"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         * @memberof ModalCalendarView#
         */
        beforeRendered : function() {
            this.$el.foundation("calendar", "reflow");
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberof ModalCalendarView#
         */
        afterRendered : function() {
            // カレンダー表示
            var calendar = this.$el.find("[data-modal-calendar]");
            var targetDate = moment().format("YYYY-MM-DD");

            calendar.val(targetDate);
            calendar.fcdp({
                fixed : true,
                dateSelector : true,
            });

            // calendar.bind('dateChange', function(evt, opts) {
            // console.info('dateChange triggered');
            // var targetDate = new Date(evt.target.value);
            // newsView.setDate(targetDate);

            // targetDate = targetDate.format("%Y-%m-%d");
            // newsView.targetDate = targetDate;
            // });
        },

        /**
         * イベント
         * @memberof ModalCalendarView#
         */
        events : {
            "click #modal-calendar-overlay" : "onClickOverlay"
        },

        /**
         * 初期化処理
         * @memberof ModalCalendarView#
         */
        initialize : function() {
        },

        /**
         * オーバレイをクリックした時に呼ばれる
         * @memberof ModalCalendarView#
         * @param {Event} ev
         */
        onClickOverlay : function (ev) {
            // オーバーレイの背景部分をタップした場合のみ処理する
            if (!$(ev.currentTarget).is("#modal-calendar-overlay")) {
                return;
            }

            this.trigger("closeModalCalendar");
        }
    });

    module.exports = ModalCalendarView;
});
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var rome = require("rome");
    var foundationCalendar = require("foundation-calendar");
    var AbstractView = require("modules/view/AbstractView");

    require("moment/locale/ja");

    /**
     * @class
     * @exports ModalCalendarView
     * @constructor
     */
    var ModalCalendarView = AbstractView.extend({
        /**
         * テンプレート
         * @memberOf ModalCalendarView#
         */
        template : require("ldsh!templates/news/common/modal-calendar"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         * @memberOf ModalCalendarView#
         */
        beforeRendered : function() {
            this.$el.foundation("calendar", "reflow");
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf ModalCalendarView#
         */
        afterRendered : function() {
            var self = this;

            if (this.calendar) {
                this.calendar.destroy();
            }

            // カレンダー表示
            this.calendar = rome($("[data-modal-calendar]")[0], {
                time: false,
                initialValue: moment(app.currentDate)
            });
            this.calendar.on("data", this.onChangeDate.bind(this));
        },

        /**
         * イベント
         * @memberOf ModalCalendarView#
         */
        events : {
            "click #modal-calendar-overlay" : "onClickOverlay",
            "click .rd-day-body" : "onClickDate"
        },

        /**
         * 初期化処理
         * @memberOf ModalCalendarView#
         */
        initialize : function() {
            moment.locale("ja");
        },

        /**
         * オーバレイをクリックした時に呼ばれる
         * @memberOf ModalCalendarView#
         * @param {Event} ev
         */
        onClickOverlay : function (ev) {
            // オーバーレイの背景部分をタップした場合のみ処理する
            if (!$(ev.target).is("#modal-calendar-overlay")) {
                return;
            }

            this.trigger("closeModalCalendar");
        },

        /**
         * 日付が変更された後に呼ばれる
         * @memberOf ModalCalendarView#
         * @param {moment} date
         */
        onChangeDate: function (date) {
            // onChangeDateでそのままルーティングしてしまうと
            // 月をめくったタイミングでも画面更新されてしまうので
            // ひとまず選択した日付を保存しておいて
            // 日付セルがクリックされた時だけ実際のルーティングを行う
            this.selectedDate = date;
        },

        /**
         * 日付セルがクリックされた後に呼ばれる
         * @memberOf ModalCalendarView#
         */
        onClickDate: function () {
            app.router.go("top", moment(this.selectedDate).format("YYYY-MM-DD"));
        }
    });

    module.exports = ModalCalendarView;
});
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
                dayFormat: "D",
                monthFormat: "YYYY年:M月",
                weekStart: moment().weekday(1).day(),
                time: false,
                initialValue: moment(app.currentDate)
            });

            this.calendar.on("data", this.onChangeDate.bind(this));
            this.calendar.on("show", this.onRenderCalendar.bind(this));
            this.calendar.on("data", this.onRenderCalendar.bind(this));
        },

        /**
         * Viewが破棄される時に呼ばれる
         * @memberOf ModalCalendarView#
         */
        cleanup : function () {
            if (this.calendar) {
                this.calendar.destroy();
            }
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
        },

        /**
         * カレンダーがレンダリングされたら呼ばれる
         * @memberOf ModalCalendarView#
         */
        onRenderCalendar : function () {
            var el = this.calendar.container;

            // この時点では $(el).find(".rd-month-label") で要素を取得できないので
            // DOMが構築されるまで待機する必要がある
            setTimeout(function () {
                $(el).find(".rd-month-label").html(function (index, yearMonthStr) {
                    var yearMonth = yearMonthStr.split(":");
                    var year = yearMonth[0];
                    var month = yearMonth[1];

                    return "<span class='rd-month-label__year'>" + year + "</span>" +
                        "<span class='rd-month-label__month'>" + month + "</span>";
                });
            }, 0);
        }
    });

    module.exports = ModalCalendarView;
});
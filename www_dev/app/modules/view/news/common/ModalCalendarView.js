define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var rome = require("rome");
    var foundationCalendar = require("foundation-calendar");
    var AbstractView = require("modules/view/AbstractView");
    var BusinessUtil = require("modules/util/BusinessUtil");
    var NewspaperHolidayCollection = require("modules/collection/misc/NewspaperHolidayCollection");
    var vexDialog = require("vexDialog");

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
            var latestPublishDate = moment(BusinessUtil.getCurrentPublishDate()).startOf('day');

            if (this.calendar) {
                this.calendar.destroy();
            }

            // カレンダー表示
            this.calendar = rome($("[data-modal-calendar]")[0], {
                dayFormat: "D",
                monthFormat: "YYYY年:M月",
                weekStart: moment().weekday(1).day(),
                max: latestPublishDate,
                time: false,
                initialValue: moment(app.currentDate)
            });

            this.calendar.on("data", this.onChangeDate.bind(this));
            this.calendar.on("show", this.onRenderCalendar.bind(this));
            this.calendar.on("data", this.onRenderCalendar.bind(this));

            $(document).trigger("open:modal");
        },

        /**
         * Viewが破棄される時に呼ばれる
         * @memberOf ModalCalendarView#
         */
        cleanup : function () {
            if (this.calendar) {
                this.calendar.destroy();
            }

            $(document).trigger("close:modal");
        },

        /**
         * イベント
         * @memberOf ModalCalendarView#
         */
        events : {
            "click #modal-calendar-overlay" : "onClickOverlay",
            "click [data-close]" : "onClickCloser",
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
         * 閉じるボタンをクリックした時に呼ばれる
         * @memberOf ModalCalendarView#
         * @param {Event} ev
         */
        onClickCloser : function (ev) {
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
         * @param {Event} ev
         */
        onClickDate: function (ev) {
            // クリックしたセルが（未配信日等の）無効な日付でない場合は遷移する
            if (!$(ev.target).is(".rd-day-disabled")) {
                this.showLoading();
                var holCol = new NewspaperHolidayCollection();
                holCol.prevPublished(moment(this.selectedDate).toDate(), function(prev, isPublish, e) {
                    if (this.selectedDate === app.currentDate) {
                        this.hideLoading();
                        this.trigger("closeModalCalendar");
                    }
                    if (e) {
                        app.logger.error("error ModalCalendarView:holCol.prevPublished()");
                        vexDialog.defaultOptions.className = 'vex-theme-default';
                        vexDialog.alert("休刊日の取得に失敗しました。");
                        this.hideLoading();
                    }
                    if (!isPublish) {
                        // 休刊日
                        vexDialog.defaultOptions.className = 'vex-theme-default';
                        vexDialog.alert("その日は休刊日のため、記事はありません。");
                        this.hideLoading();
                    } else {
                        app.router.navigate("top/" + moment(this.selectedDate).format("YYYY-MM-DD"), {
                            trigger: true,
                            replace: true
                        });
                    }
                }.bind(this));
            }
        },

        /**
         * カレンダーがレンダリングされたら呼ばれる
         * @memberOf ModalCalendarView#
         */
        onRenderCalendar : function () {
            var self = this;
            var el = this.calendar.container;

            // この時点では $(el).find(".rd-month-label") で要素を取得できないので
            // DOMが構築されるまで待機する必要がある
            setTimeout(function () {
                // 「yyyy年:M月」形式の文字列を整形する。未整形の場合のみ処理を行う
                if ($(el).find(".rd-month-label .rd-month-label__year").length === 0) {
                    var year, month;
                    $(el).find(".rd-month-label").html(function (index, yearMonthStr) {
                        var yearMonth = yearMonthStr.split(":");
                        year = parseInt(yearMonth[0]);
                        month = parseInt(yearMonth[1]);
    
                        return "<span class='rd-month-label__year'>" + year + "年</span>" +
                            "<span class='rd-month-label__month'>" + month + "月</span>";
                    });
                    // 今日の日付の要素にclass rd-today をつける。
                    var today = new Date(app.currentPublishDate);
                    var selectedDate = moment(self.selectedDate);
                    if (year === today.getFullYear() && month === today.getMonth() + 1) {
                        $('.rd-day-body:not(.rd-day-prev-month):not(.rd-day-next-month)').eq(today.getDate() - 1)
                                .addClass("rd-today");
                    }
                }
            }, 0);
        }
    });

    module.exports = ModalCalendarView;
});

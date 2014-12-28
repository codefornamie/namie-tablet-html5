define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var AbstractView = require("modules/view/AbstractView");
    var BacknumberListView = require("modules/view/backnumber/BacknumberListView");
    var BacknumberCollection = require("modules/collection/backnumber/BacknumberCollection");
    var DateUtil = require("modules/util/DateUtil");
    var BusinessUtil = require("modules/util/BusinessUtil");

    /**
     *  バックナンバーページのView
     *
     *  @class
     *  @exports BacknumberView
     *  @constructor
     */
    var BacknumberView = AbstractView.extend({
        /**
         *  テンプレートファイル
         * @memberOf BacknumberView#
         */
        template : require("ldsh!templates/{mode}/backnumber/backnumber"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         * @memberOf BacknumberView#
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf BacknumberView#
         */
        afterRendered : function() {
            app.ga.trackPageView("News/BackNoDate","新聞アプリ/バックナンバー日付選択ページ");

            this.updateDateLabel();
        },

        /**
         *  初期化処理
         * @memberOf BacknumberView#
         */
        initialize : function() {
            var backnumberListView = this.backnumberListView = new BacknumberListView({
                collection: new BacknumberCollection()
            });

            this.setView('#backnumber', backnumberListView);
            this.initEvents();

            $("#main").addClass("is-backnumber");
        },

        events : {
            'click [data-backnumber-month-prev]': 'onClickMonthPrev',
            'click [data-backnumber-month-next]': 'onClickMonthNext'
        },

        /**
         * イベントを初期化する
         * @memberOf BacknumberView#
         */
        initEvents: function () {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * 月を変更する
         * @param {moment} month
         * @memberOf BacknumberView#
         */
        updateMonth: function (month) {
            this.backnumberListView.collection.setMonth(month);
            this.updateDateLabel();
        },
        
        /**
         *  日付の表示を更新する
         * @memberOf BacknumberView#
         */
        updateDateLabel : function() {
            var month = moment(this.backnumberListView.collection.month);
            var isLastMonth = (DateUtil.formatDate(month.toDate(), "yyyy-MM") == DateUtil.formatDate(BusinessUtil.getCurrentPublishDate(), "yyyy-MM"));

            $(".backnumber-nav__month .date--year").html(month.years());
            $(".backnumber-nav__month .date--month").html(month.months() + 1);

            // 最新配信日の場合は「次の日」を非表示にする
            $("[data-backnumber-month-next]").css("visibility", (isLastMonth) ? "hidden" : "");

            // TODO GlobalNavViewの方で日付データを受け取って処理するようにするべし
            // TODO 暫定 
//            var $dateArea = this.$el.find(".backnumber-nav__month").find(".date-area");
            $(document).trigger("backnumber-date", {
                dateAreaHtml: "バックナンバー"
            });
//            $dateArea.hide();
        },

        /**
         *  前の月へ戻るボタンを押したら呼ばれる
         *
         *  @param {Event} evt クリックイベント
         * @memberOf BacknumberView#
         */
        onClickMonthPrev: function (evt) {
            var month = moment(this.backnumberListView.collection.month);

            month.add(-1, "month");
            
            this.updateMonth(month);
        },

        /**
         *  次の月へ進むボタンを押したら呼ばれる
         *
         *  @param {Event} evt クリックイベント
         * @memberOf BacknumberView#
         */
        onClickMonthNext: function (evt) {
            var month = moment(this.backnumberListView.collection.month);

            month.add(1, "month");
            
            this.updateMonth(month);
        },

        /**
         * ルーティングしたら呼ばれる
         * @param {String} route
         * @memberOf BacknumberView#
         */
        onRoute: function (route) {
            $("#main").removeClass("is-backnumber");

            if (route === "backnumber") {
                $("#main").addClass("is-backnumber");
            }
        },

        /**
         * ビューが破棄される時に呼ばれる
         * @memberOf BacknumberView#
         */
        cleanup: function () {
            $("#main").removeClass("is-backnumber");
        },
    });
    module.exports = BacknumberView;
});

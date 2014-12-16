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
         */
        template : require("ldsh!templates/{mode}/backnumber/backnumber"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
            app.ga.trackPageView("News/BackNoDate","新聞アプリ/バックナンバー日付選択ページ");

            this.updateDateLabel();
        },

        /**
         *  初期化処理
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
         */
        initEvents: function () {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * 月を変更する
         * @param {moment} month
         */
        updateMonth: function (month) {
            this.backnumberListView.collection.setMonth(month);
            this.updateDateLabel();
        },
        
        /**
         *  日付の表示を更新する
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
         *  @param {Event} evt
         */
        onClickMonthPrev: function (evt) {
            var month = moment(this.backnumberListView.collection.month);

            month.add(-1, "month");
            
            this.updateMonth(month);
        },

        /**
         *  次の月へ進むボタンを押したら呼ばれる
         *
         *  @param {Event} evt
         */
        onClickMonthNext: function (evt) {
            var month = moment(this.backnumberListView.collection.month);

            month.add(1, "month");
            
            this.updateMonth(month);
        },

        /**
         * ルーティングしたら呼ばれる
         * @param {String} route
         * @memberof BacknumberView#
         */
        onRoute: function (route) {
            $("#main").removeClass("is-backnumber");

            if (route === "backnumber") {
                $("#main").addClass("is-backnumber");
            }
        },

        /**
         * ビューが破棄される時に呼ばれる
         */
        cleanup: function () {
            $("#main").removeClass("is-backnumber");
        },
    });
    module.exports = BacknumberView;
});

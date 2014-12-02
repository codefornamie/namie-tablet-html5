define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var BacknumberDateNewsView = require("modules/view/backnumber/BacknumberDateNewsView");
    var DateUtil = require("modules/util/DateUtil");

    /**
     *  バックナンバーページで見る各日付の記事のView
     *
     *  @class
     *  @exports BacknumberDateView
     *  @constructor
     */
    var BacknumberDateView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/backnumber/backnumberDate"),
        date : null,
        newsView: null,

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
            this.showNewsView();
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
            app.ga.trackPageView("BackNoList","新聞アプリ/バックナンバー記事一覧ページ");

            this.updateDateLabel();
        },

        /**
         *  初期化処理
         */
        initialize : function(options) {
            console.assert(options && options.date, 'Please pass the date value');

            options = options || {};

            var date = options.date;

            if (!(date instanceof Date)) {
                date = Date.parse(date);
            }
            if (!date) {
                date = new Date();
            }

            this.date = date;
        },

        events : {
            'click [data-backnumber-day-prev]': 'onClickDayPrev',
            'click [data-backnumber-day-next]': 'onClickDayNext'
        },

        /**
         *  前の日へ戻るボタンを押したら呼ばれる
         *
         *  @param {Event} evt
         */
        onClickDayPrev: function (evt) {
            this.changeDate( DateUtil.addDay(this.date, -1) );
            this.updateDateLabel();
        },

        /**
         *  次の日へ進むボタンを押したら呼ばれる
         *
         *  @param {Event} evt
         */
        onClickDayNext: function (evt) {
            this.changeDate( DateUtil.addDay(this.date, 1) );
            this.updateDateLabel();
        },

        /**
         *  記事一覧画面を表示する
         */
        showNewsView : function() {
            console.assert(this.date, 'date shoud be specified');

            this.newsView = new BacknumberDateNewsView({
                date: this.date
            });
            this.setView('#backnumber-news', this.newsView);
        },

        /**
         *  記事一覧の表示対象日を変更する
         *
         *  @param {Date} date - 表示対象日
         */
        changeDate : function(date) {
            this.date = date;

            this.newsView.setArticleSearchCondition({
                targetDate: this.date
            });
            this.newsView.searchArticles();
        },

        /**
         *  日付の表示を更新する
         */
        updateDateLabel : function() {
            $(".backnumber-nav__month .date--year").html(DateUtil.formatDate(this.date, "yyyy"));
            $(".backnumber-nav__month .date--month").html(DateUtil.formatDate(this.date, "MM"));
            $(".backnumber-nav__month .date--day").html(DateUtil.formatDate(this.date, "dd"));
            $(".backnumber-nav__month .date--weekday").html(DateUtil.formatDate(this.date, "ddd"));
        }
    });
    module.exports = BacknumberDateView;
});

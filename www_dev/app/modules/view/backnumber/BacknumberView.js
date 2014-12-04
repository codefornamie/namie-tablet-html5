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
        },

        events : {
            'click [data-backnumber-month-prev]': 'onClickMonthPrev',
            'click [data-backnumber-month-next]': 'onClickMonthNext'
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
        },

        /**
         *  前の月へ戻るボタンを押したら呼ばれる
         *
         *  @param {Event} evt
         */
        onClickMonthPrev: function (evt) {
            // [TODO] 選択された月に従ってthis.backnumberListViewの内容を更新する
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
            // [TODO] 選択された月に従ってthis.backnumberListViewの内容を更新する
            var month = moment(this.backnumberListView.collection.month);
            month.add(1, "month");
            
            this.updateMonth(month);
        }
    });
    module.exports = BacknumberView;
});

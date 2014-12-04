define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var BacknumberListView = require("modules/view/backnumber/BacknumberListView");
    var BacknumberCollection = require("modules/collection/backnumber/BacknumberCollection");

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
         *  前の月へ戻るボタンを押したら呼ばれる
         *
         *  @param {Event} evt
         */
        onClickMonthPrev: function (evt) {
            // [TODO] 選択された月に従ってthis.backnumberListViewの内容を更新する
        },

        /**
         *  次の月へ進むボタンを押したら呼ばれる
         *
         *  @param {Event} evt
         */
        onClickMonthNext: function (evt) {
            // [TODO] 選択された月に従ってthis.backnumberListViewの内容を更新する
        }
    });
    module.exports = BacknumberView;
});

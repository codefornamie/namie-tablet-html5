define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var BacknumberDateNewsView = require("modules/view/backnumber/BacknumberDateNewsView");

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
        },

        /**
         *  初期化処理
         */
        initialize : function(param) {
            console.assert(param && param.date, 'Please pass the date value');

            this.date = param.date;
        },

        events : {
        },

        showNewsView : function() {
            console.assert(this.date, 'date shoud be specified');

            this.setView('#backnumber-news', new BacknumberDateNewsView({
                date: this.date
            }));
        }
    });
    module.exports = BacknumberDateView;
});

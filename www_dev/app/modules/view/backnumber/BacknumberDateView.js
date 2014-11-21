define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var NewsView = require("modules/view/news/NewsView");

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

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
            this.setView('#backnumber-news', new NewsView());
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
        },

        /**
         *  初期化処理
         */
        initialize : function(param) {
            console.assert(param && param.date, 'Please pass the date value');

            // [TODO] param.dateに日付が渡ってくるのでうまく利用する
        },

        events : {
        }

    });
    module.exports = BacknumberDateView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

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
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
        },

        /**
         *  初期化処理
         */
        initialize : function() {

        },

        events : {
        }

    });
    module.exports = BacknumberDateView;
});

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
        },

        /**
         *  初期化処理
         */
        initialize : function() {
            var backnumberListView = new BacknumberListView();

            backnumberListView.collection = new BacknumberCollection();
            this.setView('#backnumber', backnumberListView);
        },

        events : {
        }

    });
    module.exports = BacknumberView;
});

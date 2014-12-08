define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var HeaderView = AbstractView.extend({
        template : require("ldsh!templates/dojo/top/header"),

        beforeRendered : function() {
        },

        afterRendered : function() {
        },

        initialize : function() {
        },

        events : {
            "click [data-signout]": "onClickSignout"
        },

        /**
         * 終了ボタンがクリックされた時のイベントハンドラ
         * @param {Object} ev イベントオブジェクト
         */
        onClickSignout: function(ev) {
        }
    });

    module.exports = HeaderView;
});
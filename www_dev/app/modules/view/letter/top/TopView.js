define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 町民投稿アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 町民投稿アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/top"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },
    });

    module.exports = TopView;
});

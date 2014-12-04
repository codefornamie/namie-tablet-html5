define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListItemView = require("modules/view/dojo/top/DojoListItemView");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");

    /**
     * 道場アプリのトップ画面にあるコンテンツ一覧を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoListView
     * @constructor
     */
    var DojoListView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/dojoList"),

        beforeRendered : function() {

        },

        afterRendered : function() {
        },
        
        /**
         * 初期化
         */
        initialize: function () {
        }
    });

    module.exports = DojoListView;
});

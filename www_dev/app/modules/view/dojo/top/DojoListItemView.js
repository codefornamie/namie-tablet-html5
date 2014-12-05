define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 道場アプリのトップ画面にあるコンテンツを表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoListItemView
     * @constructor
     */
    var DojoListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/dojoListItem"),

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

    module.exports = DojoListItemView;
});

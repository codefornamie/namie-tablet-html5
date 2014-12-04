define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListView = require("modules/view/dojo/top/DojoListView");

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/top"),

        beforeRendered : function() {

        },

        afterRendered : function() {
            
        },
        
        /**
         * 初期化
         */
        initialize: function () {
            this.dojoListView = new DojoListView();
            
            this.setView("#dojo-contents", this.dojoListView);
        }
    });

    module.exports = TopView;
});

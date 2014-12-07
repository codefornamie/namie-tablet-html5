define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 道場アプリの個別画面のViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoLessonView
     * @constructor
     */
    var DojoLessonView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/lesson/dojoLesson"),

        beforeRendered : function() {

        },

        afterRendered : function() {
            
        },
        
        /**
         * 初期化
         * @param {Object} param
         */
        initialize: function (param) {
        }
    });

    module.exports = DojoLessonView;
});
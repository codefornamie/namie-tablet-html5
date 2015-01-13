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
            if (this.isNext) {
                this.$el.addClass("is-next");
            }

            if (this.isGrayedOut) {
                this.$el.addClass("is-grayedout").block({message:null});
            }
        },
        
        /**
         * 初期化
         * @param {Object} param
         * @memberOf DojoListItemView#
         */
        initialize: function (param) {
            console.assert(param, "param should be specified");

            this.isNext = param.isNext;
            this.isGrayedOut = param.isGrayedOut;
        }
    });

    module.exports = DojoListItemView;
});

/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var TabletGlobalNavView = require("modules/view/common/GlobalNavView");
    var PersonalModel = require("modules/model/personal/PersonalModel");
    var Snap = require("snap");

    /**
     * グローバルナビゲーションのViewクラスを作成する。
     * 
     * @class グローバルナビゲーションのViewクラス
     * @exports GlobalNavView
     * @constructor
     */
    var GlobalNavView = TabletGlobalNavView.extend({
        template : require("ldsh!templates/{mode}/common/global-nav"),

        /**
         * 文字サイズ変更後のタイマー
         */
        fontTimer : null,
        beforeRendered : function() {
        },

        afterRendered : function() {
            this.updateBackHomeButton();
        },

        initialize : function() {
        },

        events : {
            'click [data-back-home]': 'onClickBackHome',
        },
        
        /**
         *  今日の新聞に戻るボタンは
         *  topでは表示しない
         */
        updateBackHomeButton: function () {
            if (Backbone.history.fragment == 'posting-top') {
                $(".eventGlobal-nav").hide();
                $(".contents-wrapper").css("padding-top","55px");
            } else {
                $(".eventGlobal-nav").show();
                $("#headerTitle").text("記事入力");
                $(".contents-wrapper").css("padding-top","144px");
            }
        },
    });

    module.exports = GlobalNavView;
});

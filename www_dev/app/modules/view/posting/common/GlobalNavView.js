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
         * タイトル文字列
         */
        headerTitle: {
            "articleDetail" : "投稿した記事",
            "articleRegist" : "記事入力"
        },

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
         *  戻るボタンが押されたら呼ばれる
         */
        onClickBackHome: function (ev) {
            if($("#articleRegistConfirmWrapperPage").children().size()){
                ev.preventDefault();
                $("#articleRegistConfirmWrapperPage").children().remove();
                $("#articleRegistPage").show();
                $("#snap-content").scrollTop(0);
            }else{
                ev.preventDefault();
                app.router.back();
            }
        },
        
        /**
         *  今日の新聞に戻るボタンは
         *  topでは表示しない
         */
        updateBackHomeButton: function () {
            if (Backbone.history.fragment == 'posting-top') {
                $(".eventGlobal-nav").hide();
                $(".contents-wrapper").css("padding-top","55px");
            } else if(Backbone.history.fragment == 'articleRegist'){
                if(!$("#articleRegistConfirmPage").children().size()){
                    $(".eventGlobal-nav").show();
                    $("#headerTitle").text("記事入力");
                    $(".contents-wrapper").css("padding-top","144px");
                } else {
                    $(".eventGlobal-nav").show();
                    $("#headerTitle").text("記事確認");
                    $(".contents-wrapper").css("padding-top","144px");
                }
            } else {
                $(".eventGlobal-nav").show();
                $("#headerTitle").text(this.headerTitle[Backbone.history.fragment]);
                $(".contents-wrapper").css("padding-top","144px");
            }
        },
    });

    module.exports = GlobalNavView;
});

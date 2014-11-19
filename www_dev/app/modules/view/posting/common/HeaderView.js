/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var Equal = require("modules/util/filter/Equal");
    
    var HeaderView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/common/header"),

        beforeRendered : function() {
        },

        afterRendered : function() {
            var $target = $("[value='" + app.user.get("fontSize") + "']");
            var size = parseInt($target.attr('data-font-size'), 10);
            $('html, body').css('font-size', size + 'px');
        },

        initialize : function() {
        },

        events : {
            'click [data-font-size]': 'onClickFontSize'
        },
        /**
         *  フォントサイズ変更ボタンが押されたら呼ばれる
         */
        onClickFontSize: function (ev) {
            app.trigger('willChangeFontSize');
            
            var $target = $(ev.currentTarget);
            var size = parseInt($target.attr('data-font-size'), 10);
            
            $('html, body').css('font-size', size + 'px');

            app.trigger('didChangeFontSize');
            
            // 連続で押下された場合にリクエストが多数飛ばないようにするため
            // 数秒後に文字サイズ登録リクエストを飛ばす。
            // この間に再度文字サイズを変更されると前回の登録処理は無効とする
            if (this.fontTimer !== null) {
                clearTimeout(this.fontTimer);
            }
            this.fontTimer = setTimeout($.proxy(function() {
                this.saveFontSize($target.attr("value"));
            },this),1500);
            
        },
        /**
         *  文字サイズの保存処理
         *  @param {String} fontSize 文字サイズ
         */
        saveFontSize: function (fontSize) {
            var model = app.user;
            model.set("fontSize",fontSize);
            model.set("etag","*");
            // 文字サイズのみの保存処理のため、成功時や失敗時に
            // その都度ユーザに通知しない
            model.save(null,{});
        },    });

    module.exports = HeaderView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var LoginModel = require("modules/model/LoginModel");
    var vexDialog = require("vexDialog");
    
    /**
     * ログイン画面を表示するためのViewクラスを作成する。
     * 
     * @class ログイン画面を表示するためのView
     * @exports LoginView
     * @constructor
     */
    var LoginView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/login/login"),
        model : null,
        events : {
            "click #loginButton" : "onClickLoginButton"
        },
        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {
            this.model = new LoginModel();
        },

        /**
         * ログインボタンクリック時のコールバック関数
         * 
         * @memberOf LoginView
         */
        onClickLoginButton : function() {
            var loginId = $("#loginId").val();
            var password = $("#password").val();
            var loginModel = new LoginModel();

            this.model.set("loginId", $("#loginId").val());
            this.model.set("password", $("#password").val());

            var errmsg = this.model.validate();
            if (errmsg) {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                return vexDialog.alert(errmsg);
            }
            this.model.login($.proxy(this.onLogin, this));
        },
        /**
         * ログインボタンクリック時のコールバック関数
         * 
         * @memberOf LoginView
         * @param {string}
         *            msg 認証失敗時のメッセージ
         */
        onLogin : function(msg) {
            if (!msg) {
                this.goNextView();
            } else {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert(msg);
            }
        },
        goNextView: function() {
            app.router.go("top");
        }
            
    });

    module.exports = LoginView;
});

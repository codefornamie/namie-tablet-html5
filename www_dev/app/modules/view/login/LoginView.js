define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var LoginModel = require("modules/model/LoginModel");
    var vexDialog = require("vexDialog");
    var Log = require("modules/util/logger");

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
            setTimeout($.proxy(this.onTimeout, this), 500);
        },

        afterRendered : function() {
        },

        /**
         * 表示のタイミングをずらすタイマーのハンドラ
         */
        onTimeout : function() {
            app.pcsManager.ready($.proxy(function(error) {
                if (error) {
                    Log.info("error pcsManager.ready failure msg : " + error);
                    var ar = res.split(":");
                    if (ar[0] === "msg") {
                        if ((ar[1]) && (ar[1] === "401")) {
                            alert("認証に失敗しました。正しいログインIDまたはパスワードを入力してください。");
                            this.showMainView();
                            return;
                        }
                    }
                    alert("通信に失敗しました。電波状態を見直してください。(" + ar[1] + ")");
                    return;
                }
                Log.info("pcsManager.ready success");
                if (!app.pcsManager.accessToken) {
                    Log.info("pcsManager.ready success unknown access token ");
                    // ログイン画面を表示
                    this.showMainView();
                    return;
                }
                Log.info("pcsManager.ready success skip login view ");
                this.model.login($.proxy(this.onLogin, this));
            }, this));
        },

        showMainView : function() {
            $("#main").css("display","block");
        },

        /**
         * ビュー初期化
         */
        initialize : function() {
            Log.info("LoginView initialize");
            app.ga.trackPageView("Login", "ログイン");
            this.model = new LoginModel();
        },

        /**
         * ログインボタンクリック時のコールバック関数
         *
         * @memberOf LoginView
         */
        onClickLoginButton : function() {
            Log.info("onClickButton(Login button click handler) called ");
            app.ga.trackEvent("ニュース", "ログイン");

            var loginId = $("#loginId").val();
            var password = $("#password").val();

            this.model.set("loginId", $("#loginId").val());
            this.model.set("password", $("#password").val());

            var errmsg = this.model.validate();
            if (errmsg) {
                Log.info("validate error for Login form : " + errmsg);
                vexDialog.defaultOptions.className = 'vex-theme-default';
                return vexDialog.alert(errmsg);
            }
            this.model.login($.proxy(this.onLogin, this));
        },
        /**
         * ログインボタンクリック時のコールバック関数
         *
         * @memberOf LoginView
         * @param {string} msg 認証失敗時のメッセージ
         */
        onLogin : function(msg) {
            Log.info("onLogin callback called");
            if (!msg) {
                this.goNextView();
            } else {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert(msg);
            }
            this.showMainView();
        },
        goNextView : function() {
            app.router.go("top");
        }
    });

    module.exports = LoginView;
});

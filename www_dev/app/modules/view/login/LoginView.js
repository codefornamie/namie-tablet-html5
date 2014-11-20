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
            setTimeout($.proxy(this.onTimeout, this), 500);
        },

        afterRendered : function() {
        },

        /**
         * 表示のタイミングをずらすタイマーのハンドラ
         */
        onTimeout : function() {
            this.model.isExistAccountInAccountManager($.proxy(this.onAuthSuccess, this));
        },

        /**
         * アカウントマネージャのチェック完了時のハンドラ。
         * @param {String} res アカウントマネージャからレスポンス
         */
        onAuthSuccess : function(type, res) {
            if (type === "showLoginView") {
                //
                // ログイン画面を表示する必要がある場合
                //
                $("#main").css("display","block");
                return;
            } else if (type === "skipLoginView") {
                //
                // AccountManagerに登録されたID/PWで認証し、ログイン画面をスキップする場合
                //
                this.model.login($.proxy(this.onLogin, this));
                return;
            } else if (type === "error") {
                //
                // エラーが発生した場合
                // 「msg:401」の場合、認証失敗、ログイン画面表示
                //  上記以外はログイン画面を表示せずにエラーメッセージ表示のみ
                //
                var ar = res.split(":");
                if (ar[0] === "msg") {
                    if ((ar[1]) && (ar[1] === "401")) {
                        alert("認証に失敗しました。正しいログインIDまたはパスワードを入力してください。");
                        $("#main").css("display","block"); // ログイン画面を表示
                        return;
                    }
                }
                alert("通信に失敗しました。電波状態を見直してください。(" + ar[1] + ")");
                return;
            } else if (type === "token") {
                //
                // AccountManagerからトークンが取得できた場合
                //
                this.model.setAccessToken(res);
                this.model.login($.proxy(this.onLogin, this));
                return;
            } else {
                //
                // 上記以外の場合
                //
                $("#main").css("display","block");
            }
        },

        /**
         * ビュー初期化
         */
        initialize : function() {
            app.ga.trackPageView("/LoginView", "ログイン");
            this.model = new LoginModel();
        },

        /**
         * ログインボタンクリック時のコールバック関数
         *
         * @memberOf LoginView
         */
        onClickLoginButton : function() {
            app.ga.trackEvent("ニュース", "ログイン");

            var loginId = $("#loginId").val();
            var password = $("#password").val();

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
         * @param {string} msg 認証失敗時のメッセージ
         */
        onLogin : function(msg) {
            if (!msg) {
                this.goNextView();
            } else {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert(msg);
            }
            $("#main").css("display","block");
        },
        goNextView : function() {
            app.router.go("top");
        }

    });

    module.exports = LoginView;
});

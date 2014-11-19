define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var LoginModel = require("modules/model/LoginModel");

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
            setTimeout($.proxy(this.onTimeout, this), 1000);
        },

        /**
         * 表示のタイミングをずらすタイマーのハンドラ
         */
        onTimeout : function() {
            //this.model = new LoginModel();
            // var loginModel = this.model;
            // authAccountManagerは、成功するとアクセストークンが取得できるが、エラーが発生した場合、
            // 「msg:error message」という文字列となる。
            // エラーの場合は、エラーメッセージを表示し、ログイン画面のままとする。
            this.model.authAccountManager($.proxy(this.onAuthSuccess, this));
        },

        onAuthSuccess : function(res) {
            alert(res);
            var ar = res.split(":");
            if (ar[0] === "msg") {
                alert(ar[1]);
                return;
            }
            this.model.setAccessToken(res);
            this.goNextView();
        },

        /**
         * ビュー初期化
         */
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

            this.model.set("loginId", $("#loginId").val());
            this.model.set("password", $("#password").val());

            var errmsg = this.model.validate();
            if (errmsg) {
                return alert(errmsg);
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
                // TODO ログインユーザ情報が正式に出来た際に以下を正しく直してください。
                app.user = {
                    id : this.model.get("loginId")
                };

                // app.router.go("top");
                this.goNextView();
            } else {
                alert(msg);
            }
        },
        goNextView : function() {
            app.router.go("top");
        }

    });

    module.exports = LoginView;
});

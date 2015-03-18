/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Code = require("modules/util/Code");
    var AbstractView = require("modules/view/AbstractView");
    var LoginModel = require("modules/model/LoginModel");
    var vexDialog = require("vexDialog");
    var Log = require("modules/util/Logger");

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
            "click #loginButton" : "onClickLoginButton",
            "click #guestLoginButton" : "onClickGuestLoginButton"
        },
        beforeRendered : function() {
            app.logger.info("Start LoginView:beforeRendered");
            setTimeout($.proxy(this.onTimeout, this), 0);
        },

        afterRendered : function() {
        },

        /**
         * 表示のタイミングをずらすタイマーのハンドラ
         */
        onTimeout : function() {
            app.logger.info("Start LoginView:app.pcsManager.ready");
            app.pcsManager.loginModel = this.model;
            app.pcsManager.ready($.proxy(function(error) {
                if (error) {
                    Log.info("error pcsManager.ready failure msg : " + error);
                    var ar = error.split(":");
                    if (ar[0] === "msg") {
                        if ((ar[1]) && (ar[1] === "401")) {
                            alert("認証に失敗しました。正しいログインIDまたはパスワードを入力してください。");
                            this.showMainView();
                            return;
                        }
                    }
                    alert("通信に失敗しました。電波状態を見直して、起動し直してください。");
                    navigator.app.exitApp();
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
                if(!this.model.get("loginId")){
                    this.model.set("loginId", app.loginId);
                }
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
            app.ga.trackPageView("Login", "ログインページ");
            this.model = new LoginModel();
        },

        /**
         * ログインボタンクリック時のコールバック関数
         *
         * @memberOf LoginView
         */
        onClickLoginButton : function() {
            Log.info("onClickButton(Login button click handler) called ");

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
         * ゲストとしてログインボタンクリック時のコールバック関数
         *
         * @memberOf LoginView
         */
        onClickGuestLoginButton : function() {
            Log.info("onClickGuestLoginButton(Login button click handler) called ");

            var loginId = Code.GUEST_LOGIN_ID;
            var password = Code.GUEST_LOGIN_PASSWORD;

            this.model.set("loginId", loginId);
            this.model.set("password", password);

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
                // personalのrolesが"admin"の場合のみログインを許可する
                if (app.config.basic.mode === Code.APP_MODE_OPE && !app.user.hasRole("admin")) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("権限がないためログインできません。");
                    app.pcsManager.accessToken = null;
                    return;
                }
                app.logger.info("Success Login process.");
                app.ga.trackEvent("ログインページ", "ログイン完了");
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

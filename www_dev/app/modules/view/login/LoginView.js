define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var LoginModel = require("modules/model/LoginModel");
    var AbstractOdataModel = require("modules/model/AbstractODataModel");

    /**
     * ログイン画面を表示するためのViewクラスを作成する。
     * 
     * @class ログイン画面を表示するためのView
     * @exports LoginView
     * @constructor
     */
    var LoginView = AbstractView.extend({
        template : require("ldsh!/app/templates/login/login"),
        model : new LoginModel(),
        events : {
            "click #loginButton" : "onClickLoginButton"
        },
        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

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
                return alert(errmsg);
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
                app.router.go("top");
                var model = new AbstractOdataModel();
                model.set("test", "テスト用です");
                model.save(null, {success: function (model, response, options) {
                    console.log("save success");
                }});
                model.set("id", "defaceaa21b6456cae55c655f6121b9a")
                model.fetch({
                    success : function success(model, response, options) {
                        console.log("success");
                    },
                    error : function error(model, response, options) {
                        console.log("error");
                    }
                });
                model.destroy({success: function (model, response, options) {
                    console.log("destroy success");
                }});
            } else {
                alert(msg);
            }
        }
    });

    module.exports = LoginView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var NewsLoginView = require("modules/view/login/LoginView");
    
    /**
     * 運用管理アプリのログイン画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリのログイン画面を表示するためのView
     * @exports LoginView
     * @constructor
     */
    var LoginView = NewsLoginView.extend({
        goNextView: function() {
            app.router.go("ope-top");
        }
    });

    module.exports = LoginView;
});

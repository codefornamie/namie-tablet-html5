define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var NewsLoginView = require("modules/view/login/LoginView");
    
    /**
     * 投稿アプリのログイン画面を表示するためのViewクラスを作成する。
     * 
     * @class 投稿アプリのログイン画面を表示するためのView
     * @exports LoginView
     * @constructor
     */
    var LoginView = NewsLoginView.extend({
        goNextView: function() {
            app.router.go("posting-top");
        }
    });

    module.exports = LoginView;
});
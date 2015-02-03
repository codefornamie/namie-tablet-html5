define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var CommonLoginView = require("modules/view/login/LoginView");

    /**
     * 放射線アプリのログイン画面を表示するためのViewクラスを作成する。
     *
     * @class 放射線アプリのログイン画面を表示するためのView
     * @exports RadLoginView
     * @constructor
     */
    var RadLoginView = CommonLoginView.extend({
        /**
         *  ログイン後の画面に遷移する
         *  @memberOf RadLoginView#
         */
        goNextView : function() {
            app.router.go("rad");
        }
    });

    module.exports = RadLoginView;
});

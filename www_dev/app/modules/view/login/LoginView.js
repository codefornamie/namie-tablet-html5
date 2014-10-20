define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var LoginView = AbstractView.extend({
        template : require("ldsh!/app/templates/login/login"),
        events : {
            "click #loginButton" : "onClickLoginButton"
        },
        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

        },

        onClickLoginButton: function(event) {
            app.router.go("top");
            var dcContext = new dcc.DcContext("https://fj.baas.jp.fujitsu.com/","namie-test");
            var accessor = dcContext.asAccount("namie-test","user1","password1");
            // ODataコレクションへのアクセス準備（実際の認証処理）
            var cellobj = accessor.cell();
            var targetBox = cellobj.ctl.box.retrieve("box")
//             var targetBox = cellobj.boxCtl('__', null);
            var odata = targetBox.odata('odatacol');
        }
    });

    module.exports = LoginView;
});

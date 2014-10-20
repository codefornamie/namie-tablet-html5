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
        }
    });

    module.exports = LoginView;
});

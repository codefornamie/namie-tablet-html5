define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var LoginView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/login/login"),
        events : {
            "click #loginButton" : "onClickLoginButton"
        },
        beforeRender : function() {

        },

        afterRender : function() {

        },

        initialize : function() {

        },

        onClickLoginButton: function(event) {
            app.router.go("top");
        }
    });

    module.exports = LoginView;
});

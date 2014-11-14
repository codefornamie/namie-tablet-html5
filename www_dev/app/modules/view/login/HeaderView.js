define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var HeaderView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/login/header"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

        },

        events : {

        }
    });

    module.exports = HeaderView;
});

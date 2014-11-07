define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var GlobalNavView = AbstractView.extend({
        template : require("ldsh!/app/templates/login/global-nav"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

        },

        events : {

        }
    });

    module.exports = GlobalNavView;
});

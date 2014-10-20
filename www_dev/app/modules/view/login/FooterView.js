define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var FooterView = AbstractView.extend({
        template : require("ldsh!/app/templates/login/footer"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

        },

        events : {

        }
    });

    module.exports = FooterView;
});

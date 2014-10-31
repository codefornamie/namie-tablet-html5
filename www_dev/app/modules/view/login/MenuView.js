define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var MenuView = AbstractView.extend({
        template : require("ldsh!/app/templates/common/menu"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

        }
    });

    module.exports = MenuView;
});

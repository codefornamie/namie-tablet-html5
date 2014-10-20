define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var NewsView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/news"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

        },

        events : {

        }
    });

    module.exports = NewsView;
});

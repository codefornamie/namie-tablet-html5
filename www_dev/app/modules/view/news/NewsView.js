define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var NewsView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/news/news"),

        beforeRender : function() {

        },

        afterRender : function() {

        },

        initialize : function() {

        },

        events : {

        }
    });

    module.exports = NewsView;
});

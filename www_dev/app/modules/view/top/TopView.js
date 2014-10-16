define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var TopView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/top/top"),

        beforeRender : function() {

        },

        afterRender : function() {

        },

        initialize : function() {

        }
    });

    module.exports = TopView;
});

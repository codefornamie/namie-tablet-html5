define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var HeaderView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/common/header"),

        beforeRender : function() {

        },

        afterRender : function() {

        },

        initialize : function() {

        },

        events : {

        }
    });

    module.exports = HeaderView;
});

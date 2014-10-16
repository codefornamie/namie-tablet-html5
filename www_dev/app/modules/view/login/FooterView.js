define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var FooterView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/login/footer"),

        beforeRender : function() {

        },

        afterRender : function() {

        },

        initialize : function() {

        },

        events : {

        }
    });

    module.exports = FooterView;
});

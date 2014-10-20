define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var AbstractView = Backbone.Layout.extend({

        beforeRender : function() {
            this.beforeRendered();
        },
        beforeRendered : function() {
            
        },
        afterRender : function() {
            this.afterRendered();
        },
        afterRendered : function() {
            
        },
        initialize : function() {

        },

        events : {

        }
    });

    module.exports = AbstractView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var SettingsView = AbstractView.extend({
        template : require("ldsh!/app/templates/settings/settings"),
        beforeRendered : function() {

        },

        afterRendered : function() {
            
        },

        initialize : function() {

        },

        events : {
        }

    });
    module.exports = SettingsView;
});

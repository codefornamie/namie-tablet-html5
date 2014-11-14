define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");


    var EventsRegistedView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/events/eventsRegisted"),
        beforeRendered : function() {

        },

        afterRendered : function() {
            
        },

        initialize : function() {

        },

        events : {
        }

    });
    module.exports = EventsRegistedView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var TutorialView = AbstractView.extend({
        template : require("ldsh!/app/templates/tutorial/tutorial"),
        beforeRendered : function() {

        },

        afterRendered : function() {
            
        },

        initialize : function() {

        },

        events : {
        }

    });
    module.exports = TutorialView;
});
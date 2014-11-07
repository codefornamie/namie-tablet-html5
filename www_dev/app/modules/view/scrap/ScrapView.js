define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var ScrapView = AbstractView.extend({
        template : require("ldsh!/app/templates/scrap/scrap"),
        beforeRendered : function() {

        },

        afterRendered : function() {
            
        },

        initialize : function() {

        },

        events : {
        }

    });
    module.exports = ScrapView;
});

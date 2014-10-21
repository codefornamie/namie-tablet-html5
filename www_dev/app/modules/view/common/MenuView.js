define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var MenuView = AbstractView.extend({
        template : require("ldsh!/app/templates/common/menu"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

        },

        events : {
            "click #newsLink" : "onClickNewsLink",
            "click #eventsLink" : "onClickEventsLink",
            "click #tvLink" : "onClickTvLink"
        },
        onClickNewsLink : function() {
            app.router.go("news");
        },
        onClickEventsLink : function() {
            app.router.go("events");
        },
        onClickTvLink : function() {
            app.router.go("top");
        }
    });

    module.exports = MenuView;
});

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
            "click #topLink" : "onClickTopLink",
            "click #newsLink" : "onClickNewsLink",
            "click #eventsLink" : "onClickEventsLink",
            "click #showEventsLink" : "onClickShowEventsLink",
            "click #tvLink" : "onClickTvLink"
        },
        onClickTopLink : function() {
            app.router.go("top");
        },
        onClickNewsLink : function() {
            app.router.go("news");
        },
        onClickEventsLink : function() {
            app.router.go("events");
        },
        onClickShowEventsLink : function() {
            app.router.go("showEvents");
        },
        onClickTvLink : function() {
            app.router.go("top");
        }
    });

    module.exports = MenuView;
});

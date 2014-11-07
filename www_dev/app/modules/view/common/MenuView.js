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
            //"click #topLink" : "onClickTopLink",
            //"click #newsLink" : "onClickNewsLink",
            //"click #eventsLink" : "onClickEventsLink",
            //"click #showEventsLink" : "onClickShowEventsLink",
            //"click #tvLink" : "onClickTvLink"
            'click #goto-scrap': 'onClickScrap',
            'click #goto-tutorial': 'onClickTutorial',
            'click #goto-backnumber': 'onClickBacknumber',
            'click #goto-settings': 'onClickSettings'
        },
        
        onClickScrap: function () {
            app.router.go("scrap");
        },
        
        onClickTutorial: function () {
            app.router.go("tutorial");
        },
        
        onClickBacknumber: function () {
            app.router.go("backnumber");
        },
        
        onClickSettings: function () {
            app.router.go("settings");
        }
        //onClickTopLink : function() {
        //    app.router.go("top");
        //},
        //onClickNewsLink : function() {
        //    app.router.go("news");
        //},
        //onClickEventsLink : function() {
        //    app.router.go("events");
        //},
        //onClickShowEventsLink : function() {
        //    app.router.go("showEvents");
        //},
        //onClickTvLink : function() {
        //    app.router.go("top");
        //}
    });

    module.exports = MenuView;
});

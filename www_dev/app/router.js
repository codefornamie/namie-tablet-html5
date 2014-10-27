define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var login = require("modules/view/login/index");
    var common = require("modules/view/common/index");
    var TopView = require("modules/view/top/TopView");
    var NewsView = require("modules/view/news/NewsView");
    var EventsView = require("modules/view/events/EventsView");
    var EventsRegistedView = require("modules/view/events/EventsRegistedView");
    var ShowEventsView = require("modules/view/events/ShowEventsView");
    
    // Defining the application router.
    var Router = Backbone.Router.extend({
        initialize : function() {

            // Use main layout and set Views.
            var Layout = Backbone.Layout.extend({
                el : "main",

                template : require("ldsh!/app/templates/main"),

                views : {
                    ".header" : new login.HeaderView(),
                    ".contents" : new login.LoginView(),
                    ".footer" : new login.FooterView()
                },
                setHeader : function(headerView) {
                    this.setView(".header", headerView).render();
                },
                setFooter : function(footerView) {
                    this.setView(".footer", footerView).render();
                },
                showView: function(view) {
                    this.setView(".contents", view).render();
                }
            });

            // Render to the page.
            this.layout = new Layout();
            if (!app.noRendering) {
                this.layout.render();
            }
        },
        routes : {
            "" : "index",
            "top": "top",
            "events": "events",
            "eventsRegisted": "eventsRegisted",
            "showEvents": "showEvents",
            "news": "news"
        },

        index : function() {
            console.log("Welcome to your / route.");
//            this.layout.render();
        },
        top : function() {
            console.log("It's a top page.");
            this.layout.showView(new TopView());
            this.layout.setHeader(new common.HeaderView());
            this.layout.setFooter(new common.FooterView());
            this.commonView();
        },
        events : function() {
            console.log("It's a events page.");
            this.layout.showView(new EventsView());
            this.commonView();
        },
        eventsRegisted : function() {
            console.log("It's a eventsRegisted page.");
            this.layout.showView(new EventsRegistedView());
            this.commonView();
        },
        showEvents : function() {
            console.log("It's a show events page.");
            this.layout.showView(new ShowEventsView());
            this.commonView();
        },
        news : function() {
            console.log("It's a news page.");
            this.layout.showView(new NewsView());
            this.commonView();
        },
        // Shortcut for building a url.
        go: function() {
          return this.navigate(_.toArray(arguments).join("/"), true);
        },
        commonView: function() {
            this.layout.setView(".menu", new common.MenuView()).render();
        }
    });

    module.exports = Router;
});

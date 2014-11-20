define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var login = require("modules/view/login/index");
    login.posting = require("modules/view/posting/login/index");
    login.ope = require("modules/view/ope/login/index");

    var common = require("modules/view/common/index");
    var YouTubeView = require("modules/view/top/YouTubeView");
    var NewsView = require("modules/view/news/NewsView");

    var ScrapView = require("modules/view/scrap/ScrapView");
    var TutorialView = require("modules/view/tutorial/TutorialView");
    var BacknumberView = require("modules/view/backnumber/BacknumberView");
    var BacknumberDateView = require("modules/view/backnumber/BacknumberDateView");
    var SettingsView = require("modules/view/settings/SettingsView");

    var EventNewsView = require("modules/view/posting/news/NewsView");
    var TopView = require("modules/view/ope/top/TopView");

    // Defining the application router.
    var Router = Backbone.Router.extend({
        initialize : function() {
            // Use main layout and set Views.
            var getViews = function() {
                if (_.isEmpty(app.config.basic.mode) || app.config.basic.mode === "news") {
                    return {
                        "#header" : new login.HeaderView(),
                        "#global-nav" : new login.GlobalNavView(),
                        "#menu" : new login.MenuView(),
                        "#contents" : new login.LoginView(),
                        "#footer" : new login.FooterView()
                    };
                } else if (app.config.basic.mode === "posting") {
                    return {
                        "#header" : new login.HeaderView(),
                        "#contents" : new login.posting.LoginView(),
                    };
                } else if (app.config.basic.mode === "ope") {
                    return {
                        "#header" : new login.HeaderView(),
                        "#global-nav" : new login.GlobalNavView(),
                        "#menu" : new login.MenuView(),
                        "#contents" : new login.ope.LoginView(),
                        "#footer" : new login.FooterView()
                    };
                }
            };
            var Layout = Backbone.Layout.extend({
                el : "main",

                template : require("ldsh!templates/{mode}/main"),

                views : getViews(),

                setHeader : function(headerView) {
                    this.setView("#header", headerView).render();
                },
                setGlobalNav : function(globalNavView) {
                    this.setView("#global-nav", globalNavView).render();
                },
                setFooter : function(footerView) {
                    this.setView("#footer", footerView).render();
                },
                setMenu : function(menuView) {
                    this.setView("#menu", menuView).render();
                },
                showView : function(view) {
                    this.setView("#contents", view).render();
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
            "top" : "top",
            // "events": "events",
            // "eventsRegisted": "eventsRegisted",
            // "showEvents": "showEvents",
            // "news": "news"
            'scrap' : 'scrap',
            'tutorial' : 'tutorial',
            'backnumber' : 'backnumber',
            'backnumber/:date' : 'backnumberDate',
            'settings' : 'settings',
            'posting-top' : 'postingTop',
            'ope-top' : 'opeTop'
        },

        forceJumpToTop: function () {
            if (!app._isRunning) {
                this.navigate('', {
                    trigger: true,
                    replace: true
                });
                app._isRunning = true;
                return true;
            }

            return false;
        },

        index : function() {
            app._isRunning = true;
            if (app._isRunning) {
                setTimeout(function () {
                    console.log('click!');
                    $('#loginButton').click();
                }, 0);
            }
            console.log("Welcome to your / route.");
        },
        top : function() {
            if (this.forceJumpToTop()) return;

            console.log("It's a top page.");
            this.layout.showView(new NewsView());
            this.layout.setHeader(new common.HeaderView());
            this.layout.setGlobalNav(new common.GlobalNavView());
            this.layout.setFooter(new common.FooterView());
            this.commonView();
        },
        postingTop : function() {
            if (this.forceJumpToTop()) return;

            this.layout.showView(new EventNewsView());
            this.eventCommonView();
        },
        opeTop : function() {
            if (this.forceJumpToTop()) return;

            this.layout.showView(new TopView());
            this.commonView();
        },
        scrap : function() {
            if (this.forceJumpToTop()) return;

            console.log('[route] scrap');
            this.layout.showView(new ScrapView());
            this.commonView();
        },

        tutorial : function() {
            if (this.forceJumpToTop()) return;

            console.log('[route] tutorial');
            this.layout.showView(new TutorialView());
            this.commonView();
        },

        backnumber : function() {
            if (this.forceJumpToTop()) return;

            console.log('[route] backnumber');
            this.layout.showView(new BacknumberView());
            this.commonView();
        },

        backnumberDate : function (date) {
            if (this.forceJumpToTop()) return;

            console.log('[route] backnumber/%s', date);
            this.layout.showView(new BacknumberDateView({
                date: date
            }));
            this.commonView();
        },

        settings : function() {
            if (this.forceJumpToTop()) return;

            console.log('[route] settings');
            this.layout.showView(new SettingsView());
            this.commonView();
        },

        /*
         * events : function() { console.log("It's a events page.");
         * this.layout.showView(new EventsView()); this.commonView(); },
         * eventsRegisted : function() { console.log("It's a eventsRegisted
         * page."); this.layout.showView(new EventsRegistedView());
         * this.commonView(); }, showEvents : function() { console.log("It's a
         * show events page."); this.layout.showView(new ShowEventsView());
         * this.commonView(); }, news : function() { console.log("It's a news
         * page."); this.layout.showView(new NewsView()); this.commonView(); },
         */

        // Shortcut for building a url.
        go : function() {
            return this.navigate(_.toArray(arguments).join("/"), true);
        },
        commonView : function() {
            this.layout.setGlobalNav(new common.GlobalNavView());
            this.layout.setView("#menu", new common.MenuView()).render();
        },
        eventCommonView : function() {
            this.layout.setHeader(new common.GlobalNavView());
        },

        /**
         * 前の画面に戻る
         * http://stackoverflow.com/questions/14860461/selective-history-back-using-backbone-js
         */
        back : function() {
            window.history.back();
        }
    });

    module.exports = Router;
});

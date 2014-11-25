define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var login = require("modules/view/login/index");
    login.posting = require("modules/view/posting/login/index");
    login.ope = require("modules/view/ope/login/index");

    var common = require("modules/view/common/index");
    var postingCommon = require("modules/view/posting/common/index");
    var YouTubeView = require("modules/view/top/YouTubeView");
    var NewsView = require("modules/view/news/NewsView");

    var ScrapView = require("modules/view/scrap/ScrapView");
    var TutorialView = require("modules/view/tutorial/TutorialView");
    var BacknumberView = require("modules/view/backnumber/BacknumberView");
    var BacknumberDateView = require("modules/view/backnumber/BacknumberDateView");
    var SettingsView = require("modules/view/settings/SettingsView");

    var EventNewsView = require("modules/view/posting/news/NewsView");
    var ArticleDetailView = require("modules/view/posting/news/ArticleDetailView");
    var ArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var TopView = require("modules/view/ope/top/TopView");
    var OpeArticleRegistView = require("modules/view/ope/news/OpeArticleRegistView");
    var OpeYouTubeRegistView = require("modules/view/ope/news/OpeYouTubeRegistView");

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
            'articleDetail(#:id)' : 'articleDetail',
            'articleRegist' : 'articleRegist',
            'articleReport' : 'articleReport',
            'opeArticleRegist' : 'opeArticleRegist',
            'opeYouTubeRegist' : 'opeYouTubeRegist',
            'ope-top' : 'opeTop'
        },

        index : function() {
            console.log("Welcome to your / route.");
        },
        top : function() {
            console.log("It's a top page.");
            this.layout.showView(new NewsView());
            this.layout.setHeader(new common.HeaderView());
            this.layout.setGlobalNav(new common.GlobalNavView());
            this.layout.setFooter(new common.FooterView());
            this.commonView();
        },
        postingTop : function() {
            this.layout.showView(new EventNewsView());
            this.layout.setHeader(new postingCommon.HeaderView());
            this.layout.setGlobalNav(new postingCommon.GlobalNavView());
        },
        opeTop : function() {
            this.layout.showView(new TopView());
            this.layout.setHeader(new common.HeaderView());
            this.layout.setFooter(new common.FooterView());
        },
        scrap : function() {
            console.log('[route] scrap');
            this.layout.showView(new ScrapView());
            this.commonView();
        },

        tutorial : function() {
            console.log('[route] tutorial');
            this.layout.showView(new TutorialView());
            this.commonView();
        },

        backnumber : function() {
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
            console.log('[route] settings');
            this.layout.showView(new SettingsView());
            this.commonView();
        },
        articleDetail : function(id) {
            console.log('[route] articleDetail');
            this.layout.showView(new ArticleDetailView());
            this.layout.setGlobalNav(new postingCommon.GlobalNavView());
        },
        articleRegist : function(options) {
            console.log('[route] articleRegist');
            this.layout.showView(new ArticleRegistView(options));
            this.navigate("articleRegist");
            this.layout.setGlobalNav(new postingCommon.GlobalNavView());
        },
        articleReport : function() {
            console.log('[route] articleReport');
            this.layout.showView(new ArticleRegistView({articleCategory: "4"}));
            this.navigate("articleReport");
            this.layout.setGlobalNav(new postingCommon.GlobalNavView());
        },
        opeArticleRegist : function(options) {
            console.log('[route] opeArticleRegist');
            this.layout.setView("#contents__primary", new OpeArticleRegistView(options)).render();
            this.navigate("opeArticleRegist");
        },
        opeYouTubeRegist : function(options) {
            console.log('[route] opeYouTubeRegist');
            this.layout.setView("#contents__primary", new OpeYouTubeRegistView(options)).render();
            this.navigate("opeYouTubeRegist");
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

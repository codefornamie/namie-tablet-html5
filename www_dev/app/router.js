define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var login = require("modules/view/login/index");
    login.posting = require("modules/view/posting/login/index");
    login.ope = require("modules/view/ope/login/index");
    login.dojo = require("modules/view/dojo/login/index");

    var BusinessUtil = require("modules/util/BusinessUtil");

    var LoginModel = require("modules/model/LoginModel");

    var common = require("modules/view/common/index");
    var postingCommon = require("modules/view/posting/common/index");
    var NewsView = require("modules/view/news/NewsView");

    var ScrapView = require("modules/view/scrap/ScrapView");
    var TutorialView = require("modules/view/tutorial/TutorialView");
    var BacknumberView = require("modules/view/backnumber/BacknumberView");
    var BacknumberDateView = require("modules/view/backnumber/BacknumberDateView");

    var EventNewsView = require("modules/view/posting/news/NewsView");
    var ArticleDetailView = require("modules/view/posting/news/ArticleDetailView");
    var ArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var TopView = require("modules/view/ope/top/TopView");
    var OpeArticleRegistView = require("modules/view/ope/news/OpeArticleRegistView");
    var OpeYouTubeRegistView = require("modules/view/ope/news/OpeYouTubeRegistView");
    var OpeArticleDetailView = require("modules/view/ope/news/OpeArticleDetailView");
    var OpeEventDetailView = require("modules/view/ope/news/OpeEventDetailView");
    var OpeYouTubeDetailView = require("modules/view/ope/news/OpeYouTubeDetailView");

    var DojoTopView = require("modules/view/dojo/top/TopView");

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
                } else if (app.config.basic.mode === "dojo") {
                    return {
                        "#header" : new login.HeaderView(),
                        "#contents" : new login.dojo.LoginView(),
                    };
                } else if (app.config.basic.mode === "posting") {
                    return {
                        "#header" : new login.HeaderView(),
                        "#contents" : new login.posting.LoginView(),
                    };
                } else if (app.config.basic.mode === "ope") {
                    return {
                        "#contents" : new login.ope.LoginView(),
                        "#footer" : new login.FooterView()
                    };
                }
            };
            var Layout = Backbone.Layout.extend({
                el : "main",

                template : require("ldsh!templates/{mode}/main"),
                templateMap : {
                    news : require("ldsh!templates/news/main"),
                    ope : require("ldsh!templates/ope/main"),
                    posting : require("ldsh!templates/posting/main"),
                },
                /**
                 * 描画目に実行する処理。
                 * @memberof router#
                 */
                beforeRender : function() {
                    this.template = this.templateMap[app.config.basic.mode];
                },
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
                setSettings : function(settingsView) {
                    this.setView("#settings", settingsView).render();
                },
                showView : function(view) {
                    this.setView("#contents", view).render();
                },

                /**
                 * セレクタで指定したviewをremoveする
                 * 
                 * @param {String} viewName
                 */
                removeViewByName : function(viewName) {
                    var view = this.getView(viewName);

                    if (view) {
                        view.remove();
                    }
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
            "redirect?*queryString" : "redirect",
            "news?*queryString" : "top",
            "top" : "top",
            "article/:id" : "showArticle",
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
            'ope-top' : 'opeTop',
            'dojo-top' : 'dojoTop'
        },

        index : function() {
            app.logger.debug("Welcome to your / route.");
        },
        
        /**
         * 別アプリへの遷移処理。
         * @memberof router#
         * @param {String} queryString クエリ文字列。
         */
        redirect : function(queryString) {
            var params = this.parseQueryString(queryString);
            app.config.basic.mode = params.mode;
            app.preview = params.preview;
            var loginModel = new LoginModel();
            loginModel.accessToken = params.accessToken;
            loginModel.set("loginId", params.loginId);
            loginModel.login($.proxy(function(){
                this.go("news?preview=true&targetDate=" + params.targetDate);
            }, this));
        },
        
        /**
         * Top画面の表示。
         * @memberof router#
         * @param {String} queryString クエリ文字列。
         */
        top : function(queryString) {
            app.logger.debug("It's a top page.");
            var params = this.parseQueryString(queryString);
            var targetDate = params.targetDate ? new Date(params.targetDate) : BusinessUtil.getCurrentPublishDate();
            this.layout.showView(new NewsView({
                "targetDate" : targetDate,
                "preview" : params.preview
            }));
            // this.layout.setHeader(new common.HeaderView());
            // this.layout.setGlobalNav(new common.GlobalNavView());
            // this.layout.setFooter(new common.FooterView());
            this.commonView({
                "targetDate" : targetDate
            });
        },

        /**
         * 記事詳細を表示する
         * 
         * <p>
         * `this.layout.showView`を使うと記事一覧のViewをリセットしてしまうため、
         * 記事詳細は記事一覧の上にかぶせる形で表示する。
         * </p>
         * 
         * @param {String} articleId
         */
        showArticle : function(articleId) {
            this.layout.setGlobalNav(new common.GlobalNavView());
            app.newsView.showArticle(articleId);
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
        dojoTop : function() {
            this.layout.showView(new DojoTopView());
        },
        scrap : function() {
            app.logger.debug('[route] scrap');
            this.layout.showView(new ScrapView());
            this.commonView();
        },

        tutorial : function() {
            app.logger.debug('[route] tutorial');
            this.layout.showView(new TutorialView());
            this.commonView();
        },

        backnumber : function() {
            app.logger.debug('[route] backnumber');
            this.layout.showView(new BacknumberView());
            this.commonView();
        },

        backnumberDate : function(date) {
            app.logger.debug('[route] backnumber/%s', date);
            this.layout.showView(new BacknumberDateView({
                date : date
            }));
            this.commonView();
        },

        settings : function() {
            app.logger.debug('[route] settings');
            this.layout.setSettings(new common.SettingsView());
        },

        /**
         * このメソッドは手動で呼ばれる
         */
        articleDetail : function(options) {
            app.logger.debug('[route] articleDetail');

            this.navigate("articleDetail");
            this.layout.showView(new ArticleDetailView({
                model : options.model
            }));
            this.layout.setGlobalNav(new postingCommon.GlobalNavView());
        },

        /**
         * このメソッドは手動で呼ばれる
         */
        articleRegist : function(options) {
            app.logger.debug('[route] articleRegist');

            options = options || {};

            this.navigate("articleRegist");
            this.layout.showView(new ArticleRegistView(options));
            this.layout.setGlobalNav(new postingCommon.GlobalNavView());
        },

        /**
         * このメソッドは手動で呼ばれる
         */
        articleReport : function() {
            app.logger.debug('[route] articleReport');
            this.layout.showView(new ArticleRegistView({
                articleCategory : "4"
            }));
            this.navigate("articleReport");
            this.layout.setGlobalNav(new postingCommon.GlobalNavView());
        },

        /**
         * このメソッドは手動で呼ばれる
         */
        opeArticleRegist : function(options) {
            app.logger.debug('[route] opeArticleRegist');
            this.layout.setView("#contents__primary", new OpeArticleRegistView(options)).render();
            this.navigate("opeArticleRegist");
            $("#contents__primary").scrollTop(0);
        },

        /**
         * このメソッドは手動で呼ばれる
         */
        opeYouTubeRegist : function(options) {
            app.logger.debug('[route] opeYouTubeRegist');
            this.layout.setView("#contents__primary", new OpeYouTubeRegistView(options)).render();
            this.navigate("opeYouTubeRegist");
            $("#contents__primary").scrollTop(0);
        },
        /**
         *  このメソッドは手動で呼ばれる
         */
        opeEventDetail : function(options) {
            app.logger.debug('[route] opeEventDetail');
            this.layout.setView("#contents__primary", new OpeEventDetailView(options)).render();
            this.navigate("opeEventDetail");
            $("#contents__primary").scrollTop(0);
        },
        /**
         *  このメソッドは手動で呼ばれる
         */
        opeArticleDetail : function(options) {
            app.logger.debug('[route] opeArticleDetail');
            this.layout.setView("#contents__primary", new OpeArticleDetailView(options)).render();
            this.navigate("opeArticleDetail");
            $("#contents__primary").scrollTop(0);
        },
        /**
         *  このメソッドは手動で呼ばれる
         */
        opeYouTubeDetail : function(options) {
            app.logger.debug('[route] opeYouTubeDetail');
            this.layout.setView("#contents__primary", new OpeYouTubeDetailView(options)).render();
            this.navigate("opeYouTubeDetail");
            $("#contents__primary").scrollTop(0);
        },

        /*
         * events : function() { app.logger.debug("It's a events page."); this.layout.showView(new EventsView());
         * this.commonView(); }, eventsRegisted : function() { app.logger.debug("It's a eventsRegisted page.");
         * this.layout.showView(new EventsRegistedView()); this.commonView(); }, showEvents : function() {
         * app.logger.debug("It's a show events page."); this.layout.showView(new ShowEventsView()); this.commonView(); },
         * news : function() { app.logger.debug("It's a news page."); this.layout.showView(new NewsView());
         * this.commonView(); },
         */

        // Shortcut for building a url.
        go : function() {
            return this.navigate(_.toArray(arguments).join("/"), true);
        },
        commonView : function(options) {
            this.layout.setGlobalNav(new common.GlobalNavView(options));
            this.layout.setView("#menu", new common.MenuView()).render();
            this.layout.removeViewByName('#settings');
        },
        /**
         * 前の画面に戻る http://stackoverflow.com/questions/14860461/selective-history-back-using-backbone-js
         */
        back : function() {
            window.history.back();
        },

        /**
         * URLのクエリ文字列をパースする。
         * @param {String} queryString クエリ文字列
         * @return {Object} queryStringをパースした結果のマップオブジェクト。
         */
        parseQueryString : function(queryString) {
            var params = {};
            if (queryString) {
                _.each(_.map(decodeURI(queryString).split(/&/g), function(el, i) {
                    var aux = el.split('='), o = {};
                    if (aux.length >= 1) {
                        var val;
                        if (aux.length == 2)
                            val = aux[1];
                        o[aux[0]] = val;
                    }
                    return o;
                }), function(o) {
                    _.extend(params, o);
                });
            }
            return params;
        }        
    });

    module.exports = Router;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Code = require("modules/util/Code");
    var login = require("modules/view/login/index");
    login.letter = require("modules/view/letter/login/index");
    login.posting = require("modules/view/posting/login/index");
    login.ope = require("modules/view/ope/login/index");
    login.dojo = require("modules/view/dojo/login/index");

    var BusinessUtil = require("modules/util/BusinessUtil");

    var LoginModel = require("modules/model/LoginModel");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var NewspaperHolidayCollection = require("modules/collection/misc/NewspaperHolidayCollection");

    var common = require("modules/view/common/index");
    var postingCommon = require("modules/view/posting/common/index");
    var dojoCommon = require("modules/view/dojo/common/index");
    var NewsView = require("modules/view/news/NewsView");

    var ScrapView = require("modules/view/scrap/ScrapView");
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
    var DojoLessonView = require("modules/view/dojo/lesson/DojoLessonView");
    var DojoIntroductionView = require("modules/view/dojo/top/DojoIntroductionView");

    var LetterTopView = require("modules/view/letter/top/TopView");
    var LetterGlobalNavView = require("modules/view/letter/common/GlobalNavView");

    // Use main layout and set Views.
    var getViews = function() {
        var params = parseQueryString(location.href.split("?")[1]);
        app.config.basic.mode = params.mode || app.config.basic.mode;
        if (_.isEmpty(app.config.basic.mode) || app.config.basic.mode === "news") {
            return {
                "#header" : new login.HeaderView(),
                "#global-nav" : new login.GlobalNavView(),
                "#menu" : new login.MenuView(),
                "#contents" : new login.LoginView(),
                "#footer" : new login.FooterView()
            };
        } else if (app.config.basic.mode === Code.APP_MODE_DOJO) {
            return {
                "#header" : new login.HeaderView(),
                "#contents" : new login.dojo.LoginView(),
            };
        } else if (app.config.basic.mode === Code.APP_MODE_POSTING) {
            return {
                "#header" : new login.HeaderView(),
                "#contents" : new login.posting.LoginView(),
            };
        } else if (app.config.basic.mode === Code.APP_MODE_LETTER) {
            return {
                "#header" : new login.HeaderView(),
                "#contents" : new login.letter.LoginView(),
            };
        } else if (app.config.basic.mode === Code.APP_MODE_OPE) {
            return {
                "#contents" : new login.ope.LoginView(),
                "#footer" : new login.FooterView()
            };
        }
    };

    /**
     * URLのクエリ文字列をパースする。
     * @param {String} queryString クエリ文字列
     * @return {Object} queryStringをパースした結果のマップオブジェクト。
     */
    var parseQueryString = function(queryString) {
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
    };

    // Defining the application router.
    var Layout = Backbone.Layout.extend({
        el : "main",

        template : require("ldsh!templates/{mode}/main"),

        templateMap : {
            news : require("ldsh!templates/news/main"),
            ope : require("ldsh!templates/ope/main"),
            posting : require("ldsh!templates/posting/main"),
            letter : require("ldsh!templates/letter/main"),
            dojo : require("ldsh!templates/dojo/main"),
        },

        /**
         * 描画目に実行する処理。
         * @memberOf router#
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

    /**
     * ルーター
     * @class
     * @exports Router
     * @constructor
     */
    var Router = Backbone.Router.extend({
        initialize : function() {
            // Render to the page.
            console.log("Router initialized");
            this.layout = new Layout();
            if (!app.noRendering) {
                this.layout.render();
            }
        },

        routes : {
            "" : "index",
            "redirect?*queryString" : "redirect",
            "news?*queryString" : "top",

            // 新聞アプリ
            "top" : "top",
            "top/:date" : "top",
            "article/:id" : "showArticle",
            'scrap' : 'scrap',
            'backnumber' : 'backnumber',
            'backnumber/:date' : 'backnumberDate',
            'settings' : 'settings',

            // 投稿アプリ
            'posting-top' : 'postingTop',
            "articleDetail" : "articleDetail",

            // 管理アプリ
            'ope-top' : 'opeTop',
            'ope-top/:date' : 'opeTop',

            // 道場アプリ
            'dojo-top' : 'dojoTop',
            "dojo/levels/:id" : "dojoLevel",
            "dojo/lessons/:id" : "dojoLesson",
            "dojo/levels/:id/finished" : "dojoLevelComplete",
            'dojo-introduction' : 'dojoIntroduction',

            // 町民投稿アプリ
            "letter" : "letterSelect",
            "letters" : "letterList",
            "letters/new*queryString" : "letterWizard",
            "letters/posted" : "letterWizardComplete",
            "letters/:id" : "letterDetail",
            "letters/:id/edit" : "letterEdit",
            "letters/:id/modified" : "letterEditComplete"
        },

        index : function(queryString) {
            app.logger.debug("Welcome to your / route.");
            if(queryString){
                var params = parseQueryString(queryString);
                app.config.basic.mode = params.mode;
                app.preview = params.preview;
                app.loginId = params.loginId;
                app.previewTargetDate = params.targetDate;
                app.pcsManager.refreshToken = params.refreshToken;
                app.pcsManager.accessToken = "x";
                app.pcsManager.expirationDate = -1;
                var loginModel = new LoginModel();
                loginModel.set("loginId", params.loginId);
                loginModel.login($.proxy(function(){
                }, this));
            }
        },

        /**
         * ---------- 新聞アプリ ----------
         */
        /**
         * Top画面の表示。
         * @memberOf router#
         * @param {String} targetDate 日付文字列yyyy-MM-dd
         */
        top : function(date) {
            app.logger.debug("It's a top page.");
            var targetDate = app.previewTargetDate ? app.previewTargetDate : date;
            if (targetDate) {
                // 現在の日付を記録する
                app.currentDate = targetDate;

                // 日付が設定されているなら描画開始
                this.layout.showView(new NewsView({
                    targetDate : new Date(targetDate),
                    preview : app.preview,
                    scrollTop : app.scrollTop || 0
                }));
                this.commonView({
                    "targetDate" : new Date(targetDate)
                });
            } else {
                // 日付が設定されていない場合は配信日を計算する
                BusinessUtil.calcConsiderSuspendPublication(new NewspaperHolidayCollection(), $.proxy(function(considerDate) {
                    this.go("top", considerDate);
                }, this));
            }
        },

        /**
         * 記事詳細を表示する
         * 
         * <p>
         * `this.layout.showView`を使うと記事一覧のViewをリセットしてしまうため、 記事詳細は記事一覧の上にかぶせる形で表示する。
         * </p>
         * 
         * @param {String} articleId
         */
        showArticle : function(articleId) {
            // TODO appに刺さずに別の場所で管理する
            app.scrollTop = (app.newsView) ? app.newsView.getScrollTop() : 0;

            this.layout.setGlobalNav(new common.GlobalNavView());
            this.layout.removeViewByName('#settings');
            app.newsView.showArticle(articleId);
        },

        scrap : function() {
            app.logger.debug('[route] scrap');
            this.layout.showView(new ScrapView());
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
         * ---------- イベント投稿アプリ ----------
         */
        postingTop : function() {
            this.layout.showView(new EventNewsView());
            this.layout.setHeader(new postingCommon.HeaderView());
            this.layout.setGlobalNav(new postingCommon.GlobalNavView());
        },

        /**
         * このメソッドは手動で呼ばれる
         */
        articleDetail : function(options) {
            app.logger.debug('[route] articleDetail');
            if (options) {
                this.lastArticleDetailArgs = options;
            } else {
                options = this.lastArticleDetailArgs;
            }

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
         * ---------- 管理アプリ ----------
         */
        opeTop : function(targetDate) {
            if( targetDate ) {
                this.layout.showView(new TopView({targetDate:targetDate}));
                this.layout.setHeader(new common.HeaderView());
                this.layout.setFooter(new common.FooterView());
            } else {
                BusinessUtil.calcNextPublication(function(dateString){
                    this.go("ope-top", dateString);
                }.bind(this));
            }
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
         * このメソッドは手動で呼ばれる
         */
        opeEventDetail : function(options) {
            app.logger.debug('[route] opeEventDetail');
            this.layout.setView("#contents__primary", new OpeEventDetailView(options)).render();
            this.navigate("opeEventDetail");
            $("#contents__primary").scrollTop(0);
        },
        /**
         * このメソッドは手動で呼ばれる
         */
        opeArticleDetail : function(options) {
            app.logger.debug('[route] opeArticleDetail');
            this.layout.setView("#contents__primary", new OpeArticleDetailView(options)).render();
            this.navigate("opeArticleDetail");
            $("#contents__primary").scrollTop(0);
        },
        /**
         * このメソッドは手動で呼ばれる
         */
        opeYouTubeDetail : function(options) {
            app.logger.debug('[route] opeYouTubeDetail');
            this.layout.setView("#contents__primary", new OpeYouTubeDetailView(options)).render();
            this.navigate("opeYouTubeDetail");
            $("#contents__primary").scrollTop(0);
        },

        /**
         * ---------- 道場アプリ ----------
         */
        /**
         * 道場：トップページ
         */
        dojoTop : function() {
            // 実際の描画処理はdojo/TopViewに書かれている
            // アプリのライフサイクルの中で、DojoTopViewの初期化は1度だけ行う
            if (!app.dojoTopView) {
                app.dojoTopView = new DojoTopView();
                this.layout.showView(app.dojoTopView.layout);
            }

            this.layout.setHeader(new dojoCommon.HeaderView({
                dojoContentCollection: app.dojoTopView.dojoContentCollection
            }));
        },

        /**
         * 道場：コース内コンテンツ一覧ページ
         */
        dojoLevel : function() {
            app.logger.debug("[route] dojoLevel");
            // 実際の描画処理はdojo/TopViewに書かれている
        },

        /**
         * 道場：個別ページ
         */
        dojoLesson : function() {
            // 実際の描画処理はdojo/TopViewに書かれている
        },

        /**
         * 道場：コース制覇ページ
         */
        dojoLevelFinish : function() {
            app.logger.debug("[route] dojoLevelComplete");
            // 実際の描画処理はdojo/TopViewに書かれている
        },

        /**
         * 道場：初回説明画面ページ
         */
        dojoIntroduction : function() {
            app.logger.debug("[route] dojoIntroduction");
            // 実際の描画処理はdojo/TopViewに書かれている
        },

        /**
         * ---------- 町民投稿 ----------
         */
        /**
         * 町民投稿：遷移先選択画面
         */
        letterSelect : function() {
            var letterGlobalNavView;

            // 実際の描画処理はletter/TopViewに書かれている
            // アプリのライフサイクルの中で、LetterTopViewの初期化は1度だけ行う
            if (!app.letterTopView) {
                app.letterTopView = new LetterTopView();
                letterGlobalNavView = new LetterGlobalNavView();

                this.layout.showView(app.letterTopView.layout);
                this.layout.setGlobalNav(letterGlobalNavView);
            } else {
                // 投稿後の新規記事取得処理
                app.letterTopView.initCollection();
            }
        },

        /**
         * 町民投稿：記事一覧
         */
        letterList : function() {
        },

        /**
         * 町民投稿：詳細情報ページ
         */
        letterDetail : function(id) {
        },

        /**
         * 町民投稿：詳細編集ページ
         */
        letterEdit : function() {
        },

        /**
         * 町民投稿：詳細編集完了ページ
         */
        letterEditComplete : function() {
        },

        /**
         * 町民投稿：新規投稿ウィザード
         */
        letterWizard : function() {
        },

        /**
         * 町民投稿：新規投稿ウィザード完了ページ
         */
        letterWizardComplete : function() {
        },

        /**
         * ---------- ユーティリティ ----------
         */
        /**
         * 引数をURLに展開してnavigateする
         */
        go : function() {
            return this.navigate(_.toArray(arguments).join("/"), true);
        },

        /**
         * 共通のviewをセットする
         * @param {Object} options
         */
        commonView : function(options) {
            this.layout.setGlobalNav(new common.GlobalNavView(options));
            this.layout.setView("#menu", new common.MenuView()).render();
            this.layout.removeViewByName('#settings');
        },

        /**
         * 前の画面に戻る
         * <p>
         * http://stackoverflow.com/questions/14860461/selective-history-back-using-backbone-js
         * </p>
         */
        back : function() {
            window.history.back();
        },

        parseQueryString: parseQueryString
    });

    module.exports = Router;
});

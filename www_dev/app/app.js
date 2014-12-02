define(function(require, exports, module) {
    "use strict";

    var Backbone = require("backbone");
    var Layout = require("layoutmanager");
    var dc1 = require("dc1-client");
    var jqueryvalidation = require("jqueryvalidation");
    var messageja = require("messageja");
    var nehan = require("jquerynehan");
    var blockui = require("blockui");
    var panzoom = require("panzoom");
    var config = require("resources/appConfig");
    var galocalstorage = require("galocalstorage");
    var CustomHttpClient = require("modules/CustomHttpClient");

    /**
     * HttpClient を 独自クラスに差し替え.
     */
    dcc.http.RestAdapter.prototype.createHttpClient = function() {
        return new CustomHttpClient();
    };

    // グローバルに利用できるModel
    var app = module.exports = new Backbone.Model();

    // The root path to run the application through.
    app.root = "/";
    // アプリの設定情報を保持
    app.config = config;

    // Google Analyticsの初期化
    app.ga = require("modules/util/AnalyticsUtil");
    app.ga.initialize(app);

    app.accountManager = require("modules/PcsManager");
});

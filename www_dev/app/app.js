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
    var Logger = require("modules/util/logging/Logger");

    // グローバルに利用できるModel
    var app = module.exports = new Backbone.Model();

    // The root path to run the application through.
    app.root = "/";
    // アプリの設定情報を保持
    app.config = config;

    // Google Analyticsの初期化
    app.ga = require("modules/util/AnalyticsUtil");
    app.ga.initialize(app);
    
    // ロガーの設定
    app.sessionId = Logger.createSessionId(30);
    app.logger = new Logger(app);
    app.logger.debug("Logger initilized.");
});

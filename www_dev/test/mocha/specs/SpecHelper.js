define(function(require, exports, module) {
    "use strict";
    var app = require("app");
    var async = require("async");
    var Class = require("modules/util/Class");
    var LoginModel = require("modules/model/LoginModel");

    /**
     * personium.ioの単体テストで必要となる共通処理(認証や、テストデータ作成、削除など)を、提供するクラスを作成する。
     * @class テストの共通処理を提供するクラス
     * @exports SpecHelper
     * @constructor
     */
    var SpecHelper = Class.extend({
        /**
         * 初期化
         * @memberOf SpecHelper#
         */
        init : function() {

        }
    });
    /**
     * personium.ioの接続アカウント
     * @memberOf SpecHelper#
     */
    SpecHelper.TEST_USER = "ukedon";
    /**
     * personium.ioの接続アカウントのパスワード
     * @memberOf SpecHelper#
     */
    SpecHelper.TEST_USER_PASSWORD = "namie01";

    /**
     * テストケースのbeforeメソッドの共通処理を行う。
     * @memberOf SpecHelper#
     * @param {Object} spec 呼び出し元のテストユニット
     * @param done 共通処理が完了した際に呼び出されるコールバック関数
     */
    SpecHelper.before = function(spec, done) {
        app.logger.debug("Start SpecHelper.before().");

        app.noRendering = true;
        app.logger.debug("Setting personium.io enveironments.");
        app.config.basic.mode = "news";
        // テスト用セル
        app.config.basic.cellId = "kizunatest02";
        app.logger.debug("app.config.basic:" + JSON.stringify(app.config.basic));
        // タイムアウト値を拡大
        spec.timeout(20000);
        // 認証
        app.pcsManager.accessToken = null;
        var loginModel = new LoginModel();
        loginModel.baseUrl = app.config.basic.baseUrl;
        loginModel.cellId = app.config.basic.cellId;
        loginModel.box = app.config.basic.boxName;
        loginModel.set("loginId", SpecHelper.TEST_USER);
        loginModel.set("password", SpecHelper.TEST_USER_PASSWORD);

        loginModel.login(function() {
            app.logger.debug("End SpecHelper.before().");
            done();
        });
    };
    /**
     * テストケースのbeforeEachメソッドの共通処理を行う。
     * @memberOf SpecHelper#
     * @param {Object} spec 呼び出し元のテストユニット
     * @param done 共通処理が完了した際に呼び出されるコールバック関数
     */
    SpecHelper.beforeEach = function(spec, done) {
        // タイムアウト値を拡大
        spec.timeout(20000);
    };
    /**
     * テストで作成した一時データを削除する。
     * @param {Array|Model} models 削除するモデルの配列
     * @param {Function} done 削除処理が完了した際に呼び出されるコールバック関数。
     * @memberOf SpecHelper#
     */
    SpecHelper.deleteTestData = function(models, done) {
        if (!_.isArray(models)) {
            models = [
                models
            ];
        }
        var destroyFuncs = [];
        _.each(models, function(model) {
            app.logger.debug("create destroyFunc.");
            var destroyFunc = $.proxy(function(model, callback) {
                model.destroy({
                    success : function(model, response, options) {
                        app.logger.debug("Success delete test data.");
                        callback(null);
                    },
                    error : function() {
                        assert.ok(false, "Failed delete test data.");
                        callback(null);
                    }
                });
            }, this, model);
            destroyFuncs.push(destroyFunc);
        });
        async.waterfall(destroyFuncs, function(err) {
            if (err) {
                app.logger.debug("Failed delete models" + err.toString());
            }
            done();
        });
    };

    module.exports = SpecHelper;
});

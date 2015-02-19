define(function(require, exports, module) {
    "use strict";
    var app = require("app");
    var async = require("async");
    var Class = require("modules/util/Class");
    var LoginModel = require("modules/model/LoginModel");
    var PersonalModel = require("modules/model/personal/PersonalModel");
    var AchievementModel = require("modules/model/misc/AchievementModel");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

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

        app.noRendering = false;
        app.logger.debug("Setting personium.io enveironments.");
        app.config.basic.mode = "news";
        // テスト用セル
        app.config.basic.cellId = "kizunatest04";
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
    /**
     * テスト用のパーソナルデータを作成する
     * @param {Function} done 処理が完了した際に呼び出されるコールバック関数。
     * @memberOf SpecHelper#
     */
    SpecHelper.createPersonalData = function(done) {
        var model = new PersonalModel();

        model.set("loginId", SpecHelper.TEST_USER);
        model.set("fontSize", "middle");
        model.save(null, {
            success : function(model, response, options) {
                app.logger.debug("Success creating personal data.");
                // パーソナル情報新規登録成功
                app.logger.debug("save personal model. __id: " + response.__id);
                var testDataId = response.__id;
                done(testDataId);
            },
            error : function() {
                app.logger.debug("Failed creating personal data.");
                // パーソナル情報新規登録に失敗
                done();
            }
        });
    };
    /**
     * テスト用の達成状況データを作成する
     * @param {Function} done 処理が完了した際に呼び出されるコールバック関数。
     * @memberOf SpecHelper#
     */
    SpecHelper.createAchievementData = function(done) {
        var model = new AchievementModel();

        model.set("type", "dojo_solved");
        model.set("action", "NtUAbrgnmpM");
        model.set("count", "1");
        model.set("lastActionDate", new Date().toISOString());
        model.save(null, {
            success : function(model, response, options) {
                app.logger.debug("Success creating Achievement data.");
                app.logger.debug("save Achievement model. __id: " + response.__id);
                var testDataId = response.__id;
                done(testDataId);
            },
            error : function() {
                app.logger.debug("Failed creating Achievement data.");
                done();
            }
        });
    };
    /**
     * テスト用の道場動画データを作成する
     * @param {Function} done 処理が完了した際に呼び出されるコールバック関数。
     * @memberOf SpecHelper#
     */
    SpecHelper.createDojoMovie = function(done) {
        var model = new AbstractODataModel();
        model.entity = "dojo_movie";
        model.makeSaveData = function(saveData) {
            saveData.__id = "dojo_movie1";
            saveData.videoId = "NtUAbrgnmpM";
            saveData.relationVideoId = "";
            saveData.level = "0";
            saveData.category = "";
            saveData.sequence = "1";
        };
        model.save(null, {
            success : function(model, response, options) {
                app.logger.debug("Success creating dojo_movie data.");
                // 道場動画情報新規登録成功
                app.logger.debug("save dojo_movie model. __id: " + response.__id);
                var testDataId = "dojo_movie1";
                done(testDataId);
            },
            error : function() {
                app.logger.debug("Failed creating dojo_movie data.");
                // 道場動画情報新規登録に失敗
                done();
            }
        });
    };
    module.exports = SpecHelper;
});

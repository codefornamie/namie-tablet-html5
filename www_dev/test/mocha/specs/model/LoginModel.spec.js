define(function(require) {
    "use strict";

    var app = require("app");
    var SpecHelper = require("specHelper");
    var LoginModel = require("modules/model/LoginModel");
    var PersonalCollection = require("modules/collection/personal/PersonalCollection");
    var IsNull = require("modules/util/filter/IsNull");
    var Equal = require("modules/util/filter/Equal");
    var And = require("modules/util/filter/And");

    describe("LoginModel", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });
        var loginModel;
        it("TEST-01 LoginModel#login 認証ができることを確認する", function(done) {
            loginModel = new LoginModel();
            loginModel.baseUrl = app.config.basic.baseUrl;
            loginModel.cellId = app.config.basic.cellId;
            loginModel.box = app.config.basic.boxName;
            loginModel.set("loginId", SpecHelper.TEST_USER);
            loginModel.set("password", SpecHelper.TEST_USER_PASSWORD);

            loginModel.login(function() {
                assert.ok(true, "Success login");
                done();
            });
        });
        it("TEST-02 LoginModel#validate 入力チェックが正常に動作することを確認する (password)", function(done) {
            var loginModel = new LoginModel();
            loginModel.set("loginId", "ukedon");
            var result = loginModel.validate();
            assert.equal(result, "パスワードが入力されていません。");
            done();
        });
        it("TEST-03 LoginModel#certificationWithToken トークン指定して認証を行う", function(done) {
            loginModel.certificationWithToken();
            assert.ok(true, "certificationWithToken");
            done();
        });
        it("TEST-04 LoginModel#registAccountManager AccountManagerにアカウントを登録する", function(done) {
            // 単体テスト時はアカウントマネージャ登録はできないため、メソッド呼び出しのみ
            loginModel.registAccountManager("test", "password");
            assert.ok(true, "registAccountManager");
            done();
        });
        it("TEST-05 LoginModel#login トークンを保持した状態での再ログイン", function(done) {
            loginModel.login(function() {
                assert.ok(true, "Success login");
                done();
            });
        });
        it("TEST-06 LoginModel#login パスワードが誤っている際に認証エラーとなることを確認する", function(done) {
            var token = app.pcsManager.accessToken;
            app.pcsManager.accessToken = undefined;
            var loginModel = new LoginModel();
            loginModel.baseUrl = app.config.basic.baseUrl;
            loginModel.cellId = app.config.basic.cellId;
            loginModel.box = app.config.basic.boxName;
            loginModel.set("loginId", SpecHelper.TEST_USER);
            loginModel.set("password", "invalid");

            loginModel.login(function(message) {
                assert.equal(message, "ユーザーID、または、パスワードが正しくありません。", "auth error.");
                // 後の処理のために再ログイン
                loginModel = new LoginModel();
                loginModel.baseUrl = app.config.basic.baseUrl;
                loginModel.cellId = app.config.basic.cellId;
                loginModel.box = app.config.basic.boxName;
                loginModel.set("loginId", SpecHelper.TEST_USER);
                loginModel.set("password", SpecHelper.TEST_USER_PASSWORD);

                loginModel.login(function() {
                    assert.ok(true, "Success login");
                    done();
                });
            });
        });
        var testLoginId;
        it("TEST-07 LoginModel#fetchPersonalInfo 存在しないパーソナル情報の読み込みを行った際に、パーソナル情報が生成されることを確認する", function(done) {
            testLoginId = "ukedon" + _.uniqueId();
            loginModel.set("loginId", testLoginId);
            var user = app.user;
            loginModel.fetchPersonalInfo(new PersonalCollection(), function() {
                app.user = user;
                done();
            });
        });
        it("TEST-07 LoginModel#fetchPersonalInfo 作成したパーソナル情報が存在することを確認する", function(done) {
            var collection = new PersonalCollection()
            collection.condition.filters = [
                new And([
                        new Equal("loginId", testLoginId), new IsNull("deletedAt")
                ])
            ];
            collection.fetch({
                success : function() {
                    if (collection.size() > 0) {
                        assert.ok(true, "success personai info creating.");
                        done();
                    } else {
                        assert.ok(false, "failed personai info creating.");
                    }
                },
                error : function() {
                    assert.ok(false, "failed personai info creating.");
                    done();
                }
            });
        });
    });
});

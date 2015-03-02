define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var CharacterMessageModel = require("modules/model/message/CharacterMessageModel");

    describe("CharacterMessageModel", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });

        var testDataId;
        it("TEST-01 CharacterMessageModel#save キャラクターメッセージ情報を保存できることを確認する", function(done) {
            var model = new CharacterMessageModel();
            model.set("message", "うけどんだよ\nこんにちわ！");
            model.set("type", 1);
            model.set("weight", 0);
            model.set("enabled", true);

            model.save(null, {
                success : function(model, response, options) {
                    assert.ok(true, "success creating data.");
                    testDataId = response.__id;
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "failed creating data." + response.event);
                    done();
                }
            });
        });
        var fetcheModel;
        it("TEST-02 CharacterMessageModel#fetch 作成したメッセージが取得できることを確認する", function(done) {
            fetcheModel = new CharacterMessageModel();
            fetcheModel.set("__id", testDataId);

            fetcheModel.fetch({
                success : function(model, response, options) {
                    assert.notEqual(model, undefined, 'fetched model is not undefined.');
                    assert.equal(fetcheModel.get("__id"), testDataId, "fetched model's id is correct.");
                    assert.equal(fetcheModel.get("message"), "うけどんだよ\r\nこんにちわ！", "fetched model's message is correct. message=" + fetcheModel.get("message"));
                    assert.equal(fetcheModel.get("type"), 1, "fetched model's type is correct.");
                    assert.equal(fetcheModel.get("weight"), 0, "fetched model's weight is correct.");
                    assert.equal(fetcheModel.get("enabled"), true, "fetched model's enabled is correct.");
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "fetched model is not undefined.");
                    done();
                }
            });
        });
        it("TEST-03 CharacterMessageModel#fetch 取得したメッセージを更新できることを確認する", function(done) {
            fetcheModel.set("message", "うけどんだよ\r\n更新したよ！");

            fetcheModel.save(null, {
                success : function(model, response, options) {
                    assert.ok(true, "success creating data.");
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "failed creating data.");
                    done();
                }
            });
        });
        it("TEST-04 CharacterMessageModel#fetch 更新したメッセージが取得できることを確認する", function(done) {
            fetcheModel = new CharacterMessageModel();
            fetcheModel.set("__id", testDataId);

            fetcheModel.fetch({
                success : function(model, response, options) {
                    assert.notEqual(model, undefined, 'fetched model is not undefined.');
                    assert.equal(fetcheModel.get("__id"), testDataId, "fetched model's id is correct.");
                    assert.equal(fetcheModel.get("message"), "うけどんだよ\r\n更新したよ！", "fetched model's message is correct.");
                    assert.equal(fetcheModel.get("type"), 1, "fetched model's type is correct.");
                    assert.equal(fetcheModel.get("weight"), 0, "fetched model's weight is correct.");
                    assert.equal(fetcheModel.get("enabled"), true, "fetched model's enabled is correct.");
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "fetched model is not undefined.");
                    done();
                }
            });
        });
        it("TEST-05 CharacterMessageModel#destory キャラクターメッセージ情報が削除できることを確認する", function(done) {
            fetcheModel.destroy({
                success : function(model, response, options) {
                    assert.ok(true, "Success delete test data.");
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "Failed delete test data.");
                    done();
                }
            });
        });
    });
});
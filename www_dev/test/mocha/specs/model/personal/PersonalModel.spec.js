define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var PersonalModel = require("modules/model/personal/PersonalModel");

    describe("PersonalModel", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });

        var testDataId;
        it("TEST-01 PersonalModel#save パーソナル情報の登録ができることを確認する", function(done) {
            var model = new PersonalModel();
            model.set("loginId", SpecHelper.TEST_USER + "-test");
            model.set("fontSize", "middle");

            model.save(null, {
                success : function(model, response, options) {
                    assert.ok(true, "success creating data.");
                    testDataId = response.__id;
                    done();
                },
                error : function() {
                    assert.ok(false, "failed creating data.");
                    done();
                }
            });
        });
        var fetcheModel;
        it("TEST-03 PersonalModel#fetch 登録したパーソナル情報が取得できることを確認する", function(done) {
            fetcheModel = new PersonalModel();
            fetcheModel.set("__id", testDataId);

            fetcheModel.fetch({
                success : function(model, response, options) {
                    assert.notEqual(model, undefined, 'fetched model is not undefined.');
                    assert.equal(fetcheModel.get("__id"), testDataId, "fetched model's id is correct.");
                    done();
                }
            });
        });
        it("TEST-04 PersonalModel#feupdateShowLastPublishedtch showLastPublishedが更新できることを確認する", function(done) {
            fetcheModel.updateShowLastPublished("2015-02-19");
            // このメソッドは処理完了時にコールバックしてくれないので、3s待機
            // 変更されたかどうかの確認はTEST-05で実施
            setTimeout(done, 1000);
        });
        it("TEST-05 PersonalModel#fetch パーソナル情報のshowLastPublishedが更新されていることを確認する", function(done) {
            fetcheModel = new PersonalModel();
            fetcheModel.set("__id", testDataId);

            fetcheModel.fetch({
                success : function(model, response, options) {
                    assert.notEqual(model, undefined, 'fetched model is not undefined.');
                    assert.equal(fetcheModel.get("__id"), testDataId, "fetched model's id is correct.");
                    assert.equal(fetcheModel.get("showLastPublished"), "2015-02-19", "fetched model's showLastPublished is correct.");
                    done();
                }
            });
        });
        it("TEST-06 PersonalModel#destory パーソナル情報の削除ができることを確認する", function(done) {
            fetcheModel.destroy({
                success : function(model, response, options) {
                    assert.ok(true, "Success delete test data.");
                    done();
                },
                error : function() {
                    assert.ok(false, "Failed delete test data.");
                    done();
                }
            });
        });
    });
});
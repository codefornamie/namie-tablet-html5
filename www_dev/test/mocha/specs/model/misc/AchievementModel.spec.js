define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var AchievementModel = require("modules/model/misc/AchievementModel");

    describe("AchievementModel", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });

        var testDataId;
        it("TEST-01 AchievementModel#save", function(done) {
            var model = new AchievementModel();
            model.set("type", "dojo_solved");
            model.set("action", "youtube-videoId");
            model.set("count", "1");
            model.set("lastActionDate", new Date().toISOString());

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
        it("TEST-02 AchievementModel#fetch", function(done) {
            fetcheModel = new AchievementModel();
            fetcheModel.set("__id", testDataId);

            fetcheModel.fetch({
                success : function(model, response, options) {
                    assert.notEqual(model, undefined, 'fetched model is not undefined.');
                    assert.equal(fetcheModel.get("__id"), testDataId, "fetched model's id is correct.");
                    done();
                }
            });
        });
        it("TEST-03 AchievementModel#destory", function(done) {
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
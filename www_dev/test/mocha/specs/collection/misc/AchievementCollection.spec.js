define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var moment = require("moment");
    var AchievementCollection = require("modules/collection/misc/AchievementCollection");

    // 登録テストデータのID
    var testDataId;

    describe("AchievementCollection", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });
        var fetchedModel = null;
        it("TEST-01 AchievementCollection#fetch, 達成情報が取得できることを確認する。", function(done) {
            this.timeout(20000);
            SpecHelper.createAchievementData(function(targetId) {
                testDataId = targetId;
                var collection = new AchievementCollection();
                collection.condition.top = 1000;
                collection.fetch({
                    success : function(model, response, options) {
                        assert.ok(collection.size() > 0, "Achievement collection fetched.");
                        fetchedModel = collection.find(function(model) {
                            return model.get("__id") === targetId;
                        });
                        app.logger.debug('fetchedModel.get("__id"):' + fetchedModel.get("__id"));
                        app.logger.debug('create test Achievement id=' + targetId);
                        assert.equal(fetchedModel.get("__id"), targetId, "fetched correct Achievement model.");
                        assert.equal(fetchedModel.get("type"), "dojo_solved", "fetched correct Achievement model.");
                        assert.equal(fetchedModel.get("action"), "NtUAbrgnmpM", "fetched correct Achievement model.");
                        assert.equal(fetchedModel.get("count"), "1", "fetched correct Achievement model.");
                        done();
                    },
                    error: function(model, response, options) {
                        assert.ok(false, "Achievement collection fetched.");
                        done();
                    }
                });
            });
        });

        after(function(done) {
            app.logger.debug("Start after().");
            this.timeout(20000);
            SpecHelper.deleteTestData(fetchedModel, done);
        });
    });
});

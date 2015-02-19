define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var moment = require("moment");
    var PersonalCollection = require("modules/collection/personal/PersonalCollection");

    // 登録テストデータのID
    var testDataId;

    describe("PersonalCollection", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });
        var fetchedModel = null;
        it("TEST-01 PersonalCollection#fetch, 作成したログインIDのパーソナル情報が取得できることを確認する。", function(done) {
            this.timeout(20000);
            SpecHelper.createPersonalData(function(targetId) {
                testDataId = targetId;
                var collection = new PersonalCollection();
                collection.condition.top = 1000;
                collection.fetch({
                    success : function(model, response, options) {
                        assert.ok(collection.size() > 0, "personal collection fetched.");
                        fetchedModel = collection.find(function(model) {
                            return model.get("__id") === targetId;
                        });
                        app.logger.debug('fetchedModel.get("__id"):' + fetchedModel.get("__id"));
                        app.logger.debug('create test personal id=' + targetId);
                        assert.equal(fetchedModel.get("__id"), targetId, "fetched correct personal model.");
                        assert.equal(fetchedModel.get("loginId"), SpecHelper.TEST_USER, "fetched correct personal model.");
                        assert.equal(fetchedModel.get("fontSize"), "middle", "fetched correct personal model.");
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

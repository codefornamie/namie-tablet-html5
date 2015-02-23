define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var moment = require("moment");
    var ConfigurationCollection = require("modules/collection/misc/ConfigurationCollection");

    // 登録テストデータのID
    var testDataId;

    describe("ConfigurationCollection", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });
        var fetchedModel = null;
        it("TEST-01 ConfigurationCollection#fetch, 設定情報が取得できることを確認する。", function(done) {
            this.timeout(20000);
            testDataId = "COLOR_LABEL";
            var collection = new ConfigurationCollection();
            collection.condition.top = 1000;
            collection.fetch({
                success : function(model, response, options) {
                    assert.ok(collection.size() > 0, "Configuration collection fetched.");
                    fetchedModel = collection.find(function(model) {
                        return model.get("__id") === testDataId;
                    });
                    app.logger.debug('fetchedModel.get("__id"):' + fetchedModel.get("__id"));
                    assert.equal(fetchedModel.get("__id"), testDataId, "fetched correct Configuration model.");
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "Configuration collection fetched.");
                    done();
                }
            });
        });
    });
});

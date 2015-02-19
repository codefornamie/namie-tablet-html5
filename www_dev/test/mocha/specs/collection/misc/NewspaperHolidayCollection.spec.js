define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var moment = require("moment");
    var NewspaperHolidayCollection = require("modules/collection/misc/NewspaperHolidayCollection");

    // 登録テストデータのID
    var testDataId;

    describe("NewspaperHolidayCollection", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });
        var fetchedModel = null;
        it("TEST-01 NewspaperHolidayCollection#fetch, 休刊日情報が取得できることを確認する。", function(done) {
            this.timeout(20000);
            testDataId = "2015-04-29";
            var collection = new NewspaperHolidayCollection();
            collection.condition.top = 1000;
            collection.fetch({
                success : function(model, response, options) {
                    assert.ok(collection.size() > 0, "NewspaperHoliday collection fetched.");
                    fetchedModel = collection.find(function(model) {
                        return model.get("__id") === testDataId;
                    });
                    app.logger.debug('fetchedModel.get("__id"):' + fetchedModel.get("__id"));
                    assert.equal(fetchedModel.get("__id"), testDataId, "fetched correct NewspaperHoliday model.");
                    done();
                }
            });
        });
    });
});

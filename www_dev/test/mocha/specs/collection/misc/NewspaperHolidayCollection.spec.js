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
        var newspaperHolidayCollection;
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
                },
                error: function(model, response, options) {
                    assert.ok(false, "NewspaperHoliday collection fetched.");
                    done();
                }
            });
            newspaperHolidayCollection = collection;
        });
        it("TEST-02 NewspaperHolidayCollection#prevPublished, 直近の発刊日を取得できることを確認する。", function(done) {
            newspaperHolidayCollection.prevPublished(new Date("2015-05-07"), function(prevDate, err) {
                app.logger.debug("prevDate:" + prevDate.toISOString());
                assert.equal(prevDate.toISOString(), "2015-05-01T00:00:00.000Z", "prevPublished is correct.");
                done();
            });
        });
        it("TEST-03 NewspaperHolidayCollection#nextPublish, 直近の次号発刊日を取得できることを確認する。", function(done) {
            newspaperHolidayCollection.nextPublish(new Date("2015-05-01"), function(prevDate, err) {
                app.logger.debug("prevDate:" + prevDate.toISOString());
                assert.equal(prevDate.toISOString(), "2015-05-01T00:00:00.000Z", "prevPublished is correct.");
                assert.equal(err, undefined, "nextPublish is correct.");
                done();
            });
        });
    });
});

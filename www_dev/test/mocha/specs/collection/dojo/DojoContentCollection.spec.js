define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var moment = require("moment");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var YouTubeCollection = require("modules/collection/dojo/YouTubeCollection");

    // 登録テストデータのID
    var testDataId;

    describe("DojoContentCollection", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });
        var fetchedModel = null;
        var dojoContentCollection;
        it("TEST-01 DojoContentCollection#fetch, 道場の動画情報が取得できることを確認する。", function(done) {
            this.timeout(20000);
            SpecHelper.createDojoMovie(function(targetId) {
                testDataId = targetId;
                var collection = new DojoContentCollection();
                collection.youtubeCollection = new YouTubeCollection();
                collection.condition.top = 1000;
                collection.fetch({
                    success : function(model, response, options) {
                        assert.ok(collection.size() > 0, "dojoContents collection fetched.");
                        fetchedModel = collection.find(function(model) {
                            return model.get("__id") === targetId;
                        });
                        app.logger.debug('fetchedModel.get("__id"):' + fetchedModel.get("__id"));
                        app.logger.debug('create test dojo_movie id=' + targetId);
                        assert.equal(fetchedModel.get("__id"), targetId, "fetched correct dojo_movie model.");
                        done();
                    }
                });
                dojoContentCollection = collection;
            });
        });
        it("TEST-02 DojoContentCollection#groupByEditions, 道場のコース毎のDojoEditionCollectionが取得できることを確認する。", function() {
            this.timeout(20000);
            var editionCollection = dojoContentCollection.groupByEditions();
            app.logger.debug("editionCollection.size():" + editionCollection.size());
            assert.ok(editionCollection.size() > 0, "success groupByEditions.");
            var dojoEditionModel = editionCollection.at(0);
            assert.equal(dojoEditionModel.get("editionKey"), "タブレットの使い方", "corrent dojoEditionModel.");
            assert.equal(dojoEditionModel.get("editionTitle"), "タブレットの使い方", "corrent dojoEditionModel.");
            var contentCollection = dojoEditionModel.get("contentCollection");
            assert.ok(contentCollection.size() > 0, "correct contentCollection.");
        });
        after(function(done) {
            app.logger.debug("Start after().");
            this.timeout(20000);
            SpecHelper.deleteTestData(fetchedModel, done);
        });
    });
});

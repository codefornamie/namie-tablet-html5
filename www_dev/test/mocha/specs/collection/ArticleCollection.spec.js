define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");
    var NewsSpecHelper = require("newsSpecHelper");

    var app = require("app");
    var moment = require("moment");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var IsNull = require("modules/util/filter/IsNull");
    var And = require("modules/util/filter/And");

    // 登録テストデータのID
    var testDataId;

    describe("ArticleCollection", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });
        var fetchedModel = null;
        it("TEST-01 ArticleCollection#fetch, 指定した記事IDの記事が取得できることを確認する。", function(done) {
            NewsSpecHelper.createArticleTestData("6", function(articleId) {
                testDataId = articleId;
                var collection = new ArticleCollection();
                collection.condition.top = 1000;
                collection.fetch({
                    success : function(model, response, options) {
                        assert.ok(collection.size() > 0, "article collection fetched.");
                        fetchedModel = collection.find(function(model) {
                            return model.get("__id") === articleId;
                        });
                        app.logger.debug('fetchedModel.get("__id"):' + fetchedModel.get("__id"));
                        app.logger.debug('create test article id=' + articleId);
                        assert.equal(fetchedModel.get("__id"), articleId, "fetched correct article model.");
                        done();
                    }
                });
            });
        });
        it("TEST-01 ArticleCollection#setSearchCondition, 指定した日付の記事を検索できることを確認する。", function(done) {
            var collection = new ArticleCollection();
            collection.condition.top = 1000;
            collection.setSearchCondition({
                targetDate : new Date(fetchedModel.get("publishedAt"))
            });
            collection.fetch({
                success : function(model, response, options) {
                    assert.ok(collection.size() > 0, "article collection size than 0.");
                    fetchedModel = collection.find(function(model) {
                        return model.get("publishedAt") === fetchedModel.get("publishedAt");
                    });
                    assert.equal(fetchedModel.get("__id"), testDataId, "fetched correct article model.");
                    done();
                }
            });
        });

        after(function(done) {
            app.logger.debug("Start after().");
            SpecHelper.deleteTestData(fetchedModel, done);
        });
    });
});

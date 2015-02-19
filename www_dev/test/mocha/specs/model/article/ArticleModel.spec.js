define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var Code = require("modules/util/Code");

    describe("ArticleModel", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });

        var testDataId;
        it("TEST-01 ArticleModel#save", function(done) {

            var model = new ArticleModel();
            var type = "6";
            var category = _.find(Code.ARTICLE_CATEGORY_LIST, function(category) {
                return category.key === type;
            });
            var publishedAt = moment(new Date()).format("YYYY-MM-DD");

            model.set("type", type);
            model.set("site", category.value);
            model.set("title", "UnitTestData");
            model.set("publishedAt", publishedAt);

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
        it("TEST-02 ArticleModel#fetch", function(done) {
            fetcheModel = new ArticleModel();
            fetcheModel.set("__id", testDataId);

            fetcheModel.fetch({
                success : function(model, response, options) {
                    assert.notEqual(model, undefined, 'fetched model is not undefined.');
                    assert.equal(fetcheModel.get("__id"), testDataId, "fetched model's id is correct.");
                    done();
                }
            });
        });
        it("TEST-03 ArticleModel#destory", function(done) {
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
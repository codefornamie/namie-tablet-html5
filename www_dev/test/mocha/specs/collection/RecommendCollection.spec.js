define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var RecommendCollection = require("modules/collection/article/RecommendCollection");
    var Or = require("modules/util/filter/Or");

    describe("RecommendCollection", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });

        it("TEST-01 RecommendCollection#setSearchCondition", function(done) {
            var col = new RecommendCollection();
            var dummyTargetDate = new Date(1992, 10, 31);

            col.setSearchCondition({
                targetDate : dummyTargetDate
            });

            assert.ok(col.condition.filters[0] instanceof Or);

            done();
        });
    });
});

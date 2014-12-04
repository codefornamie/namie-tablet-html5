define(function(require) {
    "use strict";

    var app = require("app");
    var RecommendCollection = require("modules/collection/article/RecommendCollection");
    var Or = require("modules/util/filter/Or");

    app.noRendering = true;

    describe("RecommendCollection", function() {
        before(function () {
            this.timeout(15000);
        });

        it("TEST-01 RecommendCollection#setSearchCondition", function(done) {
            var col = new RecommendCollection();
            var dummyTargetDate = new Date(1992, 10, 31);

            col.setSearchCondition({
                targetDate: dummyTargetDate
            });

            assert.ok(col.condition.filters[0] instanceof Or);

            done();
        });
    });
});

define(function(require) {
    "use strict";

    var app = require("app");
    var RecommendCollection = require("modules/collection/article/RecommendCollection");
    var Equal = require("modules/util/filter/Equal");
    var IsNull = require("modules/util/filter/IsNull");

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

            assert.ok(col.condition.filters[0] instanceof Equal);
            assert.ok(col.condition.filters[1] instanceof IsNull);

            done();
        });
    });
});

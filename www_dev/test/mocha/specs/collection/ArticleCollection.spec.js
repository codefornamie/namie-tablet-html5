define(function(require) {
    "use strict";

    var app = require("app");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var Equal = require("modules/util/filter/Equal");
    var IsNull = require("modules/util/filter/IsNull");

    app.noRendering = true;

    describe("ArticleCollection", function() {
        before(function () {
            this.timeout(15000);
        });

        it("TEST-01 ArticleCollection#setSearchCondition", function(done) {
            var col = new ArticleCollection();
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

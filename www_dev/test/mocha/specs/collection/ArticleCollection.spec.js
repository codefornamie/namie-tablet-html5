define(function(require) {
    "use strict";

    var app = require("app");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var IsNull = require("modules/util/filter/IsNull");
    var And = require("modules/util/filter/And");

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

            assert.ok(col.condition.filters[0] instanceof And);

            done();
        });
    });
});

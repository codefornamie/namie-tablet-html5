define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var EventsCollection = require("modules/collection/events/EventsCollection");
    var Equal = require("modules/util/filter/Equal");

    describe("EventsCollection", function() {
        before(function(done) {
            SpecHelper.before(this, done);
        });

        it("TEST-01 EventsCollection#setSearchCondition", function(done) {
            var col = new EventsCollection();
            var dummyTargetDate = new Date(1992, 10, 31);

            col.setSearchCondition({
                targetDate: dummyTargetDate
            });

            assert.ok(col.condition.filters instanceof Equal);

            done();
        });
    });
});

define(function(require) {
    "use strict";

    var app = require("app");
    var EventsCollection = require("modules/collection/events/EventsCollection");
    var Equal = require("modules/util/filter/Equal");

    app.noRendering = true;

    describe("EventsCollection", function() {
        before(function () {
            this.timeout(15000);
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

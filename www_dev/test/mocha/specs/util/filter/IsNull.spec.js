define(function(require) {
    "use strict";
    var app = require("app");
    var IsNull = require("modules/util/filter/IsNull");
    var Filter = require("modules/util/filter/Filter");

    app.noRendering = true;

    describe("IsNull", function() {
        it("TEST-01 IsNull#expression", function() {
            var isNull = new IsNull("property");
            var query = Filter.queryString([isNull]);
            assert.equal(query, "property eq null");
        });
    });
});
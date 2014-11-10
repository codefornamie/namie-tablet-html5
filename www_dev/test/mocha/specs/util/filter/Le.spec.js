define(function(require) {
    "use strict";
    var app = require("app");
    var Le = require("modules/util/filter/Le");
    var Filter = require("modules/util/filter/Filter");

    app.noRendering = true;

    describe("Le", function() {
        it("TEST-01 Le#expression", function() {
            var operator = new Le("property", 111);
            var query = Filter.queryString([operator]);
            assert.equal(query, "property le 111");
        });
        it("TEST-02 Le#expression", function() {
            var operator = new Le("property", "test");
            var query = Filter.queryString([operator]);
            assert.equal(query, "property le 'test'");
        });
        it("TEST-03 Le#expression", function() {
            var operator = new Le("property", 111, true);
            var query = Filter.queryString([operator]);
            assert.equal(query, "property lt 111");
        });
        it("TEST-04 Le#expression", function() {
            var operator = new Le("propertyA", 1);
            var operator2 = new Le("propertyB", 1);
            var query = Filter.queryString([operator, operator2]);
            assert.equal(query, "propertyA le 1 and propertyB le 1");
        });
    });
});
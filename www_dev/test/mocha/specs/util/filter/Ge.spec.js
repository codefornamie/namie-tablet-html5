define(function(require) {
    "use strict";
    var app = require("app");
    var Ge = require("modules/util/filter/Ge");
    var Filter = require("modules/util/filter/Filter");

    app.noRendering = true;

    describe("Ge", function() {
        it("TEST-01 Ge#expression", function() {
            var operator = new Ge("property", 111);
            var query = Filter.queryString([operator]);
            assert.equal(query, "property ge 111");
        });
        it("TEST-02 Ge#expression", function() {
            var operator = new Ge("property", "test");
            var query = Filter.queryString([operator]);
            assert.equal(query, "property ge 'test'");
        });
        it("TEST-03 Ge#expression", function() {
            var operator = new Ge("property", 111, true);
            var query = Filter.queryString([operator]);
            assert.equal(query, "property gt 111");
        });
        it("TEST-04 Ge#expression", function() {
            var operator = new Ge("propertyA", 1);
            var operator2 = new Ge("propertyB", 1);
            var query = Filter.queryString([operator, operator2]);
            assert.equal(query, "propertyA ge 1 and propertyB ge 1");
        });
    });
});
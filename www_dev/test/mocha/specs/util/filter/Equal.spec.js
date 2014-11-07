define(function(require) {
    "use strict";
    var app = require("app");
    var Equal = require("modules/util/filter/Equal");
    var Filter = require("modules/util/filter/Filter");

    app.noRendering = true;
    // Test that the Router exists.
    describe("Equal", function() {
        it("TEST-01 Equal#expression", function() {
            var equal = new Equal("property", 111);
            var query = Filter.queryString([equal]);
            assert.equal(query, "property eq 111");
        });
        it("TEST-02 Equal#expression", function() {
            var equal = new Equal("property", "test");
            var query = Filter.queryString([equal]);
            assert.equal(query, "property eq 'test'");
        });
        it("TEST-03 Equal#expression", function() {
            var equal = new Equal("property", [1,2,3]);
            var query = Filter.queryString([equal]);
            assert.equal(query, "( property eq 1 or property eq 2 or property eq 3 )");
        });
    });
});
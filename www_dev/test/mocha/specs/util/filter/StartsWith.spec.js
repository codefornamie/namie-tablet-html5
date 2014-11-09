define(function(require) {
    "use strict";
    var app = require("app");
    var StartsWith = require("modules/util/filter/StartsWith");
    var Or = require("modules/util/filter/Or");
    var Filter = require("modules/util/filter/Filter");

    app.noRendering = true;

    describe("StartsWith", function() {
        it("TEST-01 StartsWith#expression", function() {
            var operator = new StartsWith("property", "abc");
            var query = Filter.queryString([operator]);
            assert.equal(query, "startswith(property, 'abc')");
        });
        it("TEST-02 StartsWith#expression", function() {
            var filters = new Or([new StartsWith("property", "2013/"), new StartsWith("property", "2014/")]);
            var query = Filter.queryString(filters);
            assert.equal(query, "( startswith(property, '2013/') ) or ( startswith(property, '2014/') )");
        });
    });
});
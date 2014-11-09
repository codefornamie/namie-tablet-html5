define(function(require) {
    "use strict";
    var app = require("app");
    var Equal = require("modules/util/filter/Equal");
    var Ge = require("modules/util/filter/Ge");
    var Or = require("modules/util/filter/Or");
    var And = require("modules/util/filter/And");
    var Filter = require("modules/util/filter/Filter");

    app.noRendering = true;

    describe("Or", function() {
        it("TEST-01 Or#expression", function() {
            var filtersA = new Equal("country", "Japan");
            var filtersB = new Ge("option", 1);
            var query = Filter.queryString(new Or([filtersA, filtersB]));
            assert.equal(query, "( country eq 'Japan' ) or ( option ge 1 )");
        });
        it("TEST-02 Or#expression", function() {
            var filtersA = [new Equal("country", "Japan"), new Equal("address", "Kanagawa")];
            var filtersB = new Ge("option", 1);
            var query = Filter.queryString(new Or([filtersA, filtersB]));
            assert.equal(query, "( country eq 'Japan' and address eq 'Kanagawa' ) or ( option ge 1 )");
        });
        it("TEST-03 Or#expression", function() {
            var filtersA = new Or([new Equal("country", "Japan"), new Equal("address", "Kanagawa")]);
            var filtersB = new Ge("option", 1);
            var query = Filter.queryString(new And([filtersA, filtersB]));
            assert.equal(query, "( ( country eq 'Japan' ) or ( address eq 'Kanagawa' ) ) and ( option ge 1 )");
        });
    });
});
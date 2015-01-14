define(function(require) {
    "use strict";
    var app = require("app");
    var Equal = require("modules/util/filter/Equal");
    var Ge = require("modules/util/filter/Ge");
    var And = require("modules/util/filter/And");
    var Filter = require("modules/util/filter/Filter");

    describe("And", function() {
        it("TEST-01 And#expression", function() {
            var filtersA = new Equal("country", "Japan");
            var filtersB = new Ge("option", 1);
            var query = Filter.queryString(new And([filtersA, filtersB]));
            assert.equal(query, "( country eq 'Japan' ) and ( option ge 1 )");
        });
        it("TEST-02 And#expression", function() {
            var filtersA = [new Equal("country", "Japan"), new Equal("address", "Kanagawa")];
            var filtersB = new Ge("option", 1);
            var query = Filter.queryString(new And([filtersA, filtersB]));
            assert.equal(query, "( country eq 'Japan' and address eq 'Kanagawa' ) and ( option ge 1 )");
        });

    });
});
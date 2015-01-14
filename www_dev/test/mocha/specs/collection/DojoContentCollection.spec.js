define(function(require) {
    "use strict";
    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var DojoEditionCollection = require("modules/collection/dojo/DojoEditionCollection");

    describe("DojoContentCollection", function() {
        before(function (done) {
            SpecHelper.before(this, done);
        });

        it("TEST-01 DojoContentCollection#groupByEditions", function(done) {
            var col = new DojoContentCollection();
            var editions = col.groupByEditions();

            assert.ok(editions instanceof DojoEditionCollection);

            done();
        });
    });
});

define(function(require) {
    "use strict";

    var app = require("app");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var DojoEditionCollection = require("modules/collection/dojo/DojoEditionCollection");

    app.noRendering = true;

    describe("DojoContentCollection", function() {
        before(function () {
            this.timeout(15000);
        });

        it("TEST-01 DojoContentCollection#groupByEditions", function(done) {
            var col = new DojoContentCollection();
            var editions = col.groupByEditions();

            assert.ok(editions instanceof DojoEditionCollection);

            done();
        });
    });
});

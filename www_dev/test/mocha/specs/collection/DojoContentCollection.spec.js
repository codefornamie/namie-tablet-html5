define(function(require) {
    "use strict";

    var app = require("app");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");

    app.noRendering = true;

    describe("DojoContentCollection", function() {
        before(function () {
            this.timeout(15000);
        });

        it("TEST-01 DojoContentCollection#groupByEdition", function(done) {
            var col = new DojoContentCollection();
            var editions = col.groupByEdition();

            assert.ok(Array.isArray(editions));

            done();
        });
    });
});

define(function(require) {
    "use strict";

    var app = require("app");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");

    app.noRendering = true;

    describe("DojoContentCollection", function() {
        before(function () {
            this.timeout(15000);
        });

        it("TEST-01 DojoContentCollection#getWatchedModels", function(done) {
            var col = new DojoContentCollection();
            var models = col.getWatchedModels();

            assert.ok(Array.isArray(models));

            done();
        });
    });
});

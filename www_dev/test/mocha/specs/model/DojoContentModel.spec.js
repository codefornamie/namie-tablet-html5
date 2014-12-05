define(function(require) {
    "use strict";

    var app = require("app");
    var _ = require("underscore");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");

    app.noRendering = true;

    describe("DojoContentModel", function() {
        before(function () {
            this.timeout(15000);
        });

        it("TEST-01 DojoContentModel#getSolvedState", function(done) {
            var dojoContentModel = new DojoContentModel();
            var state = dojoContentModel.getSolvedState();

            assert.equal(typeof state, "string");

            done();
        });

        it("TEST-02 DojoContentModel#getWatchedState", function(done) {
            var dojoContentModel = new DojoContentModel();
            var state = dojoContentModel.getWatchedState();

            assert.equal(typeof state, "string");

            done();
        });
    });
});
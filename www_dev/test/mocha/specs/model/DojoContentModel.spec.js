define(function(require) {
    "use strict";

    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var _ = require("underscore");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");

    describe("DojoContentModel", function() {
        before(function(done) {
            SpecHelper.before(this, done);
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
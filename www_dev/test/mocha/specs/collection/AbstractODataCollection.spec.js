define(function(require) {
    "use strict";
    var app = require("app");
    // テストケースの共通処理
    var SpecHelper = require("specHelper");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");

    describe("AbstractODataCollection", function() {
        before(function (done) {
            if (Backbone.fetchCache) {
                Backbone.fetchCache.enabled = false;
            }
            SpecHelper.before(this, done);
        });

        it("TEST-02 AbstractODataCollection#fetch", function(done) {
            this.timeout(20000);
            var collection = new AbstractODataCollection();
            collection.entity = "article";
            collection.fetch({
                success : function(model, response, options) {
                    done();
                }
            });
        });
    });
});

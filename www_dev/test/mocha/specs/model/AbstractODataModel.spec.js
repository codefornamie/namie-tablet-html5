define(function(require) {
    "use strict";
    // テストケースの共通処理
    var SpecHelper = require("specHelper");

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

    describe("AbstractODataModel", function() {
        before(function(done) {
            if (Backbone.fetchCache) {
                Backbone.fetchCache.enabled = false;
            }
            SpecHelper.before(this, done);
        });
        it("TEST-02 AbstractODataModel#save", function(done) {
            this.timeout(20000);
            var model = new AbstractODataModel();
            model.entity = "article";
            this.model = model;
            model.save(null, {
                success : function(model, response, options) {
                    model.set("__id", response.__id);
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "AbstractODataModel#save");
                    done();
                }
            });
        });
        it("TEST-03 AbstractODataModel#update", function(done) {
            this.timeout(20000);
            this.model.save(null, {
                success : function(model, response, options) {
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "AbstractODataModel#update");
                    done();
                }
            });
        });
        it("TEST-04 AbstractODataModel#fetch", function(done) {
            this.timeout(20000);
            var targetModel = new AbstractODataModel();
            targetModel.entity = "article";

            targetModel.set("__id", this.model.get("__id"));
            targetModel.fetch({
                success : function(model, response, options) {
                    assert.equal(targetModel.get("__id"), response.__id);
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "AbstractODataModel#fetch");
                    done();
                }
            });
        });
        it("TEST-05 AbstractODataModel#destroy", function(done) {
            this.timeout(20000);
            var targetModel = new AbstractODataModel();
            targetModel.entity = "article";

            targetModel.set("__id", this.model.get("__id"));
            targetModel.destroy({
                success : function(model, response, options) {
                    done();
                },
                error: function(model, response, options) {
                    assert.ok(false, "AbstractODataModel#destroy");
                    done();
                }
            });
        });
    });
});

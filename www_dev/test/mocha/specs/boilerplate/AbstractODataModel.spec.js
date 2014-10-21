define(function(require) {
    "use strict";
    var app = require("app");
    var LoginModel = require("modules/model/LoginModel");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    app.noRendering = true;
    // Test that the Router exists.
    describe("AbstractODataModel", function() {
        it("TEST-01 LoginModel#login", function(done) {
            var loginModel = new LoginModel();
            loginModel.set("loginId", "admin");
            loginModel.set("password", "c3s-innov");

            loginModel.login(function() {
                done();
            });
        });
        it("TEST-02 AbstractODataModel#save", function(done) {
            this.timeout(15000);
            var model = new AbstractODataModel();
            model.cell = "namiedev01";
            model.box = "box1";
            model.odata = "odata01";
            model.entity = "entity01";
            this.model = model;
            model.save(null, {
                success : function(model, response, options) {
                    done();
                }
            });
        });
        it("TEST-03 AbstractODataModel#update", function(done) {
            this.timeout(15000);
            this.model.save(null, {
                success : function(model, response, options) {
                    done();
                }
            });
        });
        it("TEST-04 AbstractODataModel#fetch", function(done) {
            this.timeout(15000);
            var targetModel = new AbstractODataModel();
            targetModel.cell = "namiedev01";
            targetModel.box = "box1";
            targetModel.odata = "odata01";
            targetModel.entity = "entity01";

            targetModel.set("id", this.model.get("id"));
            targetModel.fetch({
                success : function(model, response, options) {
                    assert.equal(targetModel.get("id"), model.get("id"));
                    done();
                }
            });
        });
        it("TEST-05 AbstractODataModel#destroy", function(done) {
            this.timeout(15000);
            var targetModel = new AbstractODataModel();
            targetModel.cell = "namiedev01";
            targetModel.box = "box1";
            targetModel.odata = "odata01";
            targetModel.entity = "entity01";

            targetModel.set("id", this.model.get("id"));
            targetModel.destroy({
                success : function(model, response, options) {
                    done();
                }
            });
        });
    });
});

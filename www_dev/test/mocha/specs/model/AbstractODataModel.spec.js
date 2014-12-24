define(function(require) {
    "use strict";
    var app = require("app");
    var LoginModel = require("modules/model/LoginModel");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    app.noRendering = true;

    describe("AbstractODataModel", function() {
        before(function () {
            if (Backbone.fetchCache) {
                Backbone.fetchCache.enabled = false;
            }
        });

        it("TEST-01 LoginModel#login", function(done) {
            this.timeout(15000);
            var loginModel = new LoginModel();
            loginModel.baseUrl = "https://test.namie-tablet.org/";
            loginModel.cellId = "kizunatest01";
            loginModel.box = "data";
            loginModel.set("loginId", "ukedon");
            loginModel.set("password", "namie01");

            loginModel.login(function() {
                done();
            });
        });
        it("TEST-02 AbstractODataModel#save", function(done) {
            this.timeout(15000);
            var model = new AbstractODataModel();
            model.cell = "kizunatest01";
            model.box = "data";
            model.odata = "odata";
            model.entity = "article";
            model.set("loginId", "ukedon");
            model.set("password", "namie01");
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
            targetModel.cell = "kizunatest01";
            targetModel.box = "data";
            targetModel.odata = "odata";
            targetModel.entity = "article";

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
            targetModel.cell = "kizunatest01";
            targetModel.box = "data";
            targetModel.odata = "odata";
            targetModel.entity = "article";

            targetModel.set("id", this.model.get("id"));
            targetModel.destroy({
                success : function(model, response, options) {
                    done();
                }
            });
        });
    });
});

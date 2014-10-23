define(function(require) {
    "use strict";
    var app = require("app");
    var LoginModel = require("modules/model/LoginModel");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    app.noRendering = true;

    // Test that the Router exists.
    describe("AbstractODataCollection", function() {
        it("TEST-01 LoginModel#login", function(done) {
            var loginModel = new LoginModel();
            loginModel.baseUrl = "https://fj.baas.jp.fujitsu.com/";
            loginModel.cellId = "namiedev01";
            loginModel.box = "box1";
            loginModel.set("loginId", "admin");
            loginModel.set("password", "c3s-innov");

            loginModel.login(function() {
                done();
            });
        });
        it("TEST-02 AbstractODataCollection#save", function(done) {
            this.timeout(15000);
            var collection = new AbstractODataCollection();
            collection.cell = "namiedev01";
            collection.box = "box1";
            collection.odata = "odata01";
            collection.entity = "entity01";

            collection.fetch({
                success : function(model, response, options) {
                    done();
                }
            });
        });
    });
});

define(function(require) {
    "use strict";
    var app = require("app");
    var LoginModel = require("modules/model/LoginModel");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    app.noRendering = true;

    describe("AbstractODataCollection", function() {
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
        it("TEST-02 AbstractODataCollection#save", function(done) {
            this.timeout(15000);
            var collection = new AbstractODataCollection();
            collection.cell = "kizunatest01";
            collection.box = "data";
            collection.odata = "odata";
            collection.entity = "article";

            collection.fetch({
                success : function(model, response, options) {
                    done();
                }
            });
        });
    });
});

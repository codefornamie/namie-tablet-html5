define(function(require) {
    "use strict";

    var app = require("app");
    var _ = require("underscore");
    var RadiationModel = require("modules/model/radiation/RadiationModel");

    app.noRendering = true;

    describe("RadiationModel", function() {
        var testData;

        before(function () {
            this.timeout(15000);
        });

        beforeEach(function(done){
            var targetJSON = {
                    "type" : "Feature",
                    "geometory" : {
                        "type" : "Point",
                        "coordinates" : ["37.492139", "140.990049", "12345"]
                    },
                    "properties" : {
                        "__id" : "RADIATION_LOG_UUID",
                        "date" : "2000-01-23T12:34:56+0900",
                        "value" : "1234",
                        "collectionId" : "COLLECTION_ID"
                    }
            };

            // テスト対象のモデル
            var radiationModel = new RadiationModel({
                __id : targetJSON.properties.__id,
                date : targetJSON.properties.date,
                latitude : targetJSON.geometory.coordinates[0],
                longitude : targetJSON.geometory.coordinates[1],
                altitude : targetJSON.geometory.coordinates[2],
                value : targetJSON.properties.value,
                collectionId : targetJSON.properties.collectionId
            });

            testData = {
                    radiationModel : radiationModel,
                    targetJSON : targetJSON
            };

            done();
        });

        it("TEST-01 RadiationModel#toGeoJSON", function(done) {
            var resultJSON = testData.radiationModel.toGeoJSON();

            assert.deepEqual(resultJSON, testData.targetJSON);

            done();
        });
    });
});
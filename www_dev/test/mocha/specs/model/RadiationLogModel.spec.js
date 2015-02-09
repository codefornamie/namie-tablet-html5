define(function(require) {
    "use strict";

    var app = require("app");
    var RadiationLogModel = require("modules/model/radiation/RadiationLogModel");

    app.noRendering = true;

    describe("RadiationLogModel", function() {
        var testData;

        before(function () {
            this.timeout(15000);
        });

        beforeEach(function(done){
            var targetJSON = {
                    "type" : "Feature",
                    "geometry" : {
                        "type" : "Point",
                        "coordinates" : ["140.990049", "37.492139", "12345"]
                    },
                    "properties" : {
                        "__id" : "RADIATION_LOG_UUID",
                        "date" : "2000-01-23T12:34:56+0900",
                        "value" : "1234",
                        "collectionId" : "COLLECTION_ID"
                    }
            };

            // テスト対象のモデル
            var radiationLogModel = new RadiationLogModel({
                __id : targetJSON.properties.__id,
                date : targetJSON.properties.date,
                longitude : targetJSON.geometry.coordinates[0],
                latitude : targetJSON.geometry.coordinates[1],
                altitude : targetJSON.geometry.coordinates[2],
                value : targetJSON.properties.value,
                collectionId : targetJSON.properties.collectionId
            });

            testData = {
                    radiationLogModel : radiationLogModel,
                    targetJSON : targetJSON
            };

            done();
        });

        it("TEST-01 RadiationLogModel#toGeoJSON", function(done) {
            var resultJSON = testData.radiationLogModel.toGeoJSON();

            assert.deepEqual(resultJSON, testData.targetJSON);

            done();
        });
    });
});

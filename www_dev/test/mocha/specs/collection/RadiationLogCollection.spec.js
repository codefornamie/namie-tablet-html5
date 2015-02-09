define(function(require) {
    "use strict";

    var app = require("app");
    var RadiationLogModel = require("modules/model/radiation/RadiationLogModel");
    var RadiationLogCollection = require("modules/collection/radiation/RadiationLogCollection");

    app.noRendering = true;

    describe("RadiationLogCollection", function() {
        var testData;

        before(function () {
            this.timeout(15000);
        });

        beforeEach(function(done){
            // テスト対象のコレクション
            var radiationLogCollection = new RadiationLogCollection();

            var targetModelJSON = {
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
            var targetJSON = {
                    "type" : "FeatureCollection",
                    "features" : []
            };

            _(10).times(function(index) {
                // テスト用モデルデータを複製
                var modelJSON = JSON.parse(JSON.stringify(targetModelJSON));

                modelJSON.properties.__id = "RADIATION_LOG_UUID_" + index;

                targetJSON.features.push(modelJSON);

                var radiationLogModel = new RadiationLogModel({
                    __id : modelJSON.properties.__id,
                    date : modelJSON.properties.date,
                    longitude : modelJSON.geometry.coordinates[0],
                    latitude : modelJSON.geometry.coordinates[1],
                    altitude : modelJSON.geometry.coordinates[2],
                    value : modelJSON.properties.value,
                    collectionId : modelJSON.properties.collectionId
                });
                radiationLogCollection.push(radiationLogModel);
            });

            testData = {
                    radiationLogCollection : radiationLogCollection,
                    targetJSON : targetJSON
            };

            done();
        });

        it("TEST-01 RadiationLogCollection#toGeoJSON", function(done) {
            var resultJSON = testData.radiationLogCollection.toGeoJSON();

            assert.deepEqual(resultJSON, testData.targetJSON);

            done();
        });
    });
});

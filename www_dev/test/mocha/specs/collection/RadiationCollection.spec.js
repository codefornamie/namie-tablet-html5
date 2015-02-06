define(function(require) {
    "use strict";

    var app = require("app");
    var RadiationModel = require("modules/model/radiation/RadiationModel");
    var RadiationCollection = require("modules/collection/radiation/RadiationCollection");

    app.noRendering = true;

    describe("RadiationCollection", function() {
        var testData;

        before(function () {
            this.timeout(15000);
        });

        beforeEach(function(done){
            // テスト対象のコレクション
            var radiationCollection = new RadiationCollection();

            var targetModelJSON = {
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
            var targetJSON = {
                    "type" : "FeatureCollection",
                    "features" : []
            };

            _(10).times(function(index) {
                // テスト用モデルデータを複製
                var modelJSON = JSON.parse(JSON.stringify(targetModelJSON));

                modelJSON.properties.__id = "RADIATION_LOG_UUID_" + index;

                targetJSON.features.push(modelJSON);

                var radiationModel = new RadiationModel({
                    __id : modelJSON.properties.__id,
                    date : modelJSON.properties.date,
                    latitude : modelJSON.geometory.coordinates[0],
                    longitude : modelJSON.geometory.coordinates[1],
                    altitude : modelJSON.geometory.coordinates[2],
                    value : modelJSON.properties.value,
                    collectionId : modelJSON.properties.collectionId
                });
                radiationCollection.push(radiationModel);
            });

            testData = {
                    radiationCollection : radiationCollection,
                    targetJSON : targetJSON
            };

            done();
        });

        it("TEST-01 RadiationCollection#toGeoJSON", function(done) {
            var resultJSON = testData.radiationCollection.toGeoJSON();

            assert.deepEqual(resultJSON, testData.targetJSON);

            done();
        });
    });
});

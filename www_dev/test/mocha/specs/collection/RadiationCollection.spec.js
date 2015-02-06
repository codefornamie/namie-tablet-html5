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

            // オブジェクト形式のテスト用データ
            var targetModelObj = {
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
            var targetObj = {
                    "type" : "FeatureCollection",
                    "features" : []
            };

            _(10).times(function(index) {
                // テスト用モデルデータを複製
                var modelObj = JSON.parse(JSON.stringify(targetModelObj));

                modelObj.properties.__id = "RADIATION_LOG_UUID_" + index;

                targetObj.features.push(modelObj);

                var radiationModel = new RadiationModel({
                    __id : modelObj.properties.__id,
                    date : modelObj.properties.date,
                    latitude : modelObj.geometory.coordinates[0],
                    longitude : modelObj.geometory.coordinates[1],
                    altitude : modelObj.geometory.coordinates[2],
                    value : modelObj.properties.value,
                    collectionId : modelObj.properties.collectionId
                });
                radiationCollection.push(radiationModel);
            });
            // JSON形式のテスト用コレクションデータ
            var targetJSON = JSON.stringify(targetObj);

            testData = {
                    radiationCollection : radiationCollection,
                    targetObj : targetObj,
                    targetJSON : targetJSON
            };

            done();
        });

        it("TEST-01 RadiationCollection#toGeoJSONObject", function(done) {
            var resultObj = testData.radiationCollection.toGeoJSONObject();

            assert.equal(typeof resultObj, "object");

            done();
        });

        it("TEST-02 RadiationCollection#toGeoJSON", function(done) {
            var resultJSON = testData.radiationCollection.toGeoJSON();

            assert.equal(resultJSON, testData.targetJSON);

            done();
        });
    });
});

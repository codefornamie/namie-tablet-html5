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
            // オブジェクト形式のテスト用データ
            var targetObj = {
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
            // JSON形式のテスト用データ
            var targetJSON = JSON.stringify(targetObj);

            // テスト対象のモデル
            var radiationModel = new RadiationModel({
                __id : targetObj.properties.__id,
                date : targetObj.properties.date,
                latitude : targetObj.geometory.coordinates[0],
                longitude : targetObj.geometory.coordinates[1],
                altitude : targetObj.geometory.coordinates[2],
                value : targetObj.properties.value,
                collectionId : targetObj.properties.collectionId
            });

            testData = {
                    radiationModel : radiationModel,
                    targetObj : targetObj,
                    targetJSON : targetJSON
            };

            done();
        });

        it("TEST-01 RadiationModel#toGeoJSONObject", function(done) {
            var resultObj = testData.radiationModel.toGeoJSONObject();

            assert.equal(typeof resultObj, "object");

            done();
        });

        it("TEST-02 RadiationModel#toGeoJSON", function(done) {
            var resultJSON = testData.radiationModel.toGeoJSON();

            assert.equal(resultJSON, testData.targetJSON);

            done();
        });
    });
});
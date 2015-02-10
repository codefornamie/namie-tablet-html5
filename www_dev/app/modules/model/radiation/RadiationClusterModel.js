define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

    /**
     * 放射線量データのモデルクラスを作成する。
     *
     * @class 放射線量データのモデルクラス
     * @exports RadiationClusterModel
     * @constructor
     */
    var RadiationClusterModel = AbstractODataModel.extend({
        entity : "radiation_cluster",

        /**
         * 取得したOData情報のparse処理を行う。
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf RadiationClusterModel#
         */
        parseOData : function(response, options) {
            console.log(response);

            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * @param {Object} saveData 永続化データ
         * @memberOf RadiationClusterModel#
         */
        makeSaveData : function(saveData) {
            saveData.userId = this.get("userId");
            saveData.createDate = this.get("createDate");
            saveData.startDate = this.get("startDate");
            saveData.endDate = this.get("endDate");
            saveData.numSample = this.get("numSample");
            saveData.maxValue = this.get("maxValue");
            saveData.averageValue = this.get("averageValue");
            saveData.maxLatitude = this.get("maxLatitude");
            saveData.minLatitude = this.get("minLatitude");
            saveData.minLongitude = this.get("minLongitude");
            saveData.maxLongitude = this.get("maxLongitude");
            saveData.isFixedStation = this.get("isFixedStation");

        },

        /**
         * GeoJSON形式に変換する。
         * @return {Object}
         * @memberOf RadiationClusterModel#
         */
        toGeoJSON : function() {
            var geoJSON;

            geoJSON = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            (this.get("minLongitude") + this.get("maxLongitude")) / 2,
                            (this.get("minLatitude") + this.get("maxLatitude")) / 2,
                            this.get("altitude")
                        ]
                    },
                    "properties": {
                        "__id": this.get("__id"),
                        "userId": this.get("userId"),
                        "createDate": this.get("createDate"),
                        "startDate": this.get("startDate"),
                        "endDate": this.get("endDate"),
                        "numSample": this.get("numSample"),
                        "maxValue": this.get("maxValue"),
                        "averageValue": this.get("averageValue"),
                        "isFixedStation": this.get("isFixedStation"),
                        "sensorVendor": this.get("sensorVendor"),
                        "sensorModel": this.get("sensorModel"),
                        "sensorSerialNo": this.get("sensorSerialNo")
                    }
            };

            return geoJSON;
        }
    });

    module.exports = RadiationClusterModel;
});

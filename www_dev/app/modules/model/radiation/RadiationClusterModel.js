define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var Code = require("modules/util/Code");

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
            saveData.errorCode = this.get("errorCode");

            // 線量最大値
            var maxValue = null;
            if (this.get("maxValue")) {
                maxValue = Math.round(this.get("maxValue") * Code.RAD_RADIATION_DOSE_MAGNIFICATION);
            }
            saveData.maxValue = maxValue;
            // 線量最小値
            var minValue = null;
            if (this.get("minValue")) {
                minValue = Math.round(this.get("minValue") * Code.RAD_RADIATION_DOSE_MAGNIFICATION);
            }
            saveData.minValue = minValue;
            // 線量平均値
            var averageValue = null;
            if (this.get("averageValue")) {
                averageValue = Math.round(this.get("averageValue") * Code.RAD_RADIATION_DOSE_MAGNIFICATION);
            }
            saveData.averageValue = averageValue;
            
            var maxLatitude = null;
            if (this.get("maxLatitude")) {
                maxLatitude = Math.round(this.get("maxLatitude") * Code.RAD_LAT_LONG_MAGNIFICATION);
            }
            saveData.maxLatitude = maxLatitude;
            var minLatitude = null;
            if (this.get("minLatitude")) {
                minLatitude = Math.round(this.get("maxLatitude") * Code.RAD_LAT_LONG_MAGNIFICATION);
            }
            saveData.minLatitude = minLatitude;
            var minLongitude = null;
            if (this.get("minLongitude")) {
                minLongitude = Math.round(this.get("minLongitude") * Code.RAD_LAT_LONG_MAGNIFICATION);
            }
            saveData.minLongitude = minLongitude;
            var maxLongitude = null;
            if (this.get("maxLongitude")) {
                maxLongitude = Math.round(this.get("maxLongitude") * Code.RAD_LAT_LONG_MAGNIFICATION);
            }
            saveData.maxLongitude = maxLongitude;
            saveData.isFixedStation = this.get("isFixedStation");
            
            // TODO 他の端末対応をした際には切り分ける
            saveData.sensorVendor = "HORIBA";
            saveData.sensorModel = "PA-1100";
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
                        "minValue": this.get("minValue"),
                        "averageValue": this.get("averageValue"),
                        "isFixedStation": this.get("isFixedStation"),
                        "sensorVendor": this.get("sensorVendor"),
                        "sensorModel": this.get("sensorModel"),
                        "sensorSerialNo": this.get("sensorSerialNo"),
                        "errorCode": this.get("errorCode")
                    }
            };

            return geoJSON;
        }
    });

    module.exports = RadiationClusterModel;
});

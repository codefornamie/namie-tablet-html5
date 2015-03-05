define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractUserScriptModel = require("modules/model/AbstractUserScriptModel");
    var HoribaRecordValidator = require("modules/util/HoribaRecordValidator");
    var Code = require("modules/util/Code");

    /**
     * 放射線量データのモデルクラスを作成する。
     *
     * @class 放射線量データのモデルクラス
     * @exports RadiationLogModel
     * @constructor
     */
    var RadiationLogModel = AbstractUserScriptModel.extend({
        serviceName: 'radiation_log',
        entity : "radiation_log",

        /**
         * 取得したOData情報のparse処理を行う。
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf RadiationLogModel#
         */
        parseOData : function(response, options) {
            console.log(response);

            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * @param {Object} saveData 永続化データ
         * @memberOf RadiationLogModel#
         */
        makeSaveData : function(saveData) {
            if (this.get("logModels")) {
                // userscriptで一括登録する際に設定される
                saveData.logModels = this.get("logModels");
            }

            saveData.date = this.get("date");
            var latitude = null;
            if (this.get("latitude")) {
                latitude = Math.round(this.get("latitude") * Code.RAD_LAT_LONG_MAGNIFICATION);
            }
            saveData.latitude = latitude;
            var longitude = null;
            if (this.get("longitude")) {
                longitude = Math.round(this.get("longitude") * Code.RAD_LAT_LONG_MAGNIFICATION);
            }
            saveData.longitude = longitude;
            var altitude = null;
            if (this.get("altitude")) {
                altitude = Math.round(this.get("altitude") * Code.RAD_ALTITUDE_MAGNIFICATION);
            }
            saveData.altitude = altitude;
            var value = null;
            if (this.get("value")) {
                value = Math.round(this.get("value") * Code.RAD_RADIATION_DOSE_MAGNIFICATION);
            }
            saveData.value = value;
            saveData.collectionId = this.get("collectionId");
        },

        /**
         * GeoJSON形式に変換する。
         * @return {Object}
         * @memberOf RadiationLogModel#
         */
        toGeoJSON : function() {
            var geoJSON;

            geoJSON = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            this.get("longitude"),
                            this.get("latitude"),
                            this.get("altitude")
                        ]
                    },
                    "properties": {
                        "__id": this.get("__id"),
                        "date": this.get("date"),
                        "value": this.get("value"),
                        "collectionId": this.get("collectionId"),
                        "errorCode": this.get("errorCode")
                    }
            };

            return geoJSON;
        },
        /**
         * このモデルの文字列情報を取得する
         * @memberOf RadiationLogModel#
         * @return {String} このモデルの文字列情報
         */
        toString : function() {
            return "RadiationLogModel [date:" + this.get("date") + ", latitude:" + this.get("latitude") +
                    ", longitude:" + this.get("longitude") + ", altitude:" + this.get("altitude") + ", value:" +
                    this.get("value") + ", collectionId:" + this.get("collectionId") + "]";
        }
    });

    module.exports = RadiationLogModel;
});

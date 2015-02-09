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
        entity : "radiation",

        /**
         * 取得したOData情報のparse処理を行う。
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf RadiationClusterModel#
         */
        parseOData : function(response, options) {
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * @param {Object} saveData 永続化データ
         * @memberOf RadiationClusterModel#
         */
        makeSaveData : function(saveData) {
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
                    "geometory": {
                        "type": "Point",
                        "coordinates": [this.get("latitude"), this.get("longitude"), this.get("altitude")]
                    },
                    "properties": {
                        "__id": this.get("__id"),
                        "date": this.get("date"),
                        "value": this.get("value"),
                        "collectionId": this.get("collectionId")
                    }
            };

            return geoJSON;
        }
    });

    module.exports = RadiationClusterModel;
});
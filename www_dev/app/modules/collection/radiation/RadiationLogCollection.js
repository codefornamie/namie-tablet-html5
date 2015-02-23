define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RadiationLogModel = require("modules/model/radiation/RadiationLogModel");

    /**
     * 放射線量データのコレクションクラス
     * @class 放射線量データのコレクションクラス
     * @exports RadiationLogCollection
     * @constructor
     */
    var RadiationLogCollection = AbstractODataCollection.extend({
        model : RadiationLogModel,
        entity : "radiation",
        condition : {
            top : 1,
            orderby : "dateTime desc",
            filter : "station eq '浪江町役場'"
        },
        /**
         * 配列をマップに変換する。
         * 
         * @param {Object} レスポンス情報
         * @param {Object} オプション
         * @return {Objecy} レスポンス情報
         * @memberOf RadiationLogCollection#
         */
        parseOData: function (response, options) {
            var res = response.map(function (log) {
                return _.extend(log, {
                    latitude : log.latitude / Math.pow(10, 6),
                    longitude : log.longitude / Math.pow(10, 6),
                    altitude : log.altitude / Math.pow(10, 3),
                    value : log.value / Math.pow(10, 3)
                });
            });

            return res;
        },

        /**
         * GeoJSON形式に変換する。
         * @return {Object}
         * @memberOf RadiationLogCollection#
         */
        toGeoJSON : function() {
            var geoJSON;
            var features = [];

            this.each(function(model) {
                features.push(model.toGeoJSON());
            });

            geoJSON = {
                    "type": "FeatureCollection",
                    "features": features
            };

            return geoJSON;
        }
    });

    module.exports = RadiationLogCollection;
});

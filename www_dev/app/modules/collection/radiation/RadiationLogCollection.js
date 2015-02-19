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
        entity : "radiation_log",
        /**
         * 初期化処理
         * @memberOf ArticleCollection#
         */
        initialize : function() {
            this.condition = {
                top : 10000,
                orderby : "date desc"
            };
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
            // TODO Entityが正式にスキーマ定義され正しいデータが入ったら消す
            response = _.filter(response, function(ress) {
                if (!ress.latitude || !ress.longitude || !ress.altitude || !ress.value) {
                    return false;
                }
                return true;
            });
            // ここまで

            
            
            var res = response.map(function (log) {
                // TODO Entityが正式にスキーマ定義され正しいデータが入ったら消す
                log.latitude = parseInt(log.latitude);
                log.longitude = parseInt(log.longitude);
                log.altitude = parseInt(log.altitude);
                log.value = parseInt(log.value);
                // ここまで

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

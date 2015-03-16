define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RadiationLogModel = require("modules/model/radiation/RadiationLogModel");
    var And = require("modules/util/filter/And");
    var Equal = require("modules/util/filter/Equal");
    var Ge = require("modules/util/filter/Ge");

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
         * @memberOf RadiationLogCollection#
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
            // 地図上に表示できないようなデータは省く
            response = _.filter(response, function(ress) {
                if (!ress.latitude || !ress.longitude) {
                    return false;
                }
                return true;
            });
            
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
         * clusterに紐付いたradiationLogの検索条件設定を行う
         * @memberOf RadiationLogCollection#
         */
        setSearchConditionIncludeInCluster : function() {
            this.condition.filters = [
                new And([
                    new Equal("collectionId", this.collectionId),
                    new Ge("value", 0, true)
                ])
            ];
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

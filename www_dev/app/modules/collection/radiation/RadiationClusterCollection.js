define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RadiationClusterModel = require("modules/model/radiation/RadiationClusterModel");
    var Equal = require("modules/util/filter/Equal");

    /**
     * 放射線量データのコレクションクラス
     * @class 放射線量データのコレクションクラス
     * @exports RadiationClusterCollection
     * @constructor
     */
    var RadiationClusterCollection = AbstractODataCollection.extend({
        model : RadiationClusterModel,
        entity : "radiation_cluster",
        /**
         * 初期化処理
         * @memberOf RadiationClusterCollection#
         */
        initialize : function() {
            this.condition = {
                    top : 50,
                    orderby : "createDate desc"
            };
        },

        /**
         * 配列をマップに変換する。
         * 
         * @param {Object} レスポンス情報
         * @param {Object} オプション
         * @return {Objecy} レスポンス情報
         * @memberOf RadiationClusterCollection#
         */
        parseOData : function(response, options) {
            // 地図上に表示できないようなデータは省く
            response = _.filter(response, function(ress) {
                if (!ress.minLatitude || !ress.maxLatitude || !ress.minLongitude || !ress.maxLongitude ||
                        !ress.averageValue || !ress.maxValue) {
                    return false;
                }
                return true;
            });
            
            var res = response.map(function(cluster) {
                return _.extend(cluster, {
                    minLatitude : cluster.minLatitude / Math.pow(10, 6),
                    maxLatitude : cluster.maxLatitude / Math.pow(10, 6),
                    minLongitude : cluster.minLongitude / Math.pow(10, 6),
                    maxLongitude : cluster.maxLongitude / Math.pow(10, 6),
                    averageValue : cluster.averageValue / Math.pow(10, 3),
                    maxValue : cluster.maxValue / Math.pow(10, 3)
                });
            });

            return res;
        },
        /**
         * 自身がアップロードしたclusterの検索条件設定を行う
         * @memberOf RadiationClusterCollection#
         */
        setSearchConditionByMyself : function() {
            this.condition.filters = [
                new Equal("userId", app.user.get("__id"))
            ];
        },

        /**
         * GeoJSON形式に変換する。
         * @return {Object}
         * @memberOf RadiationClusterCollection#
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

    module.exports = RadiationClusterCollection;
});

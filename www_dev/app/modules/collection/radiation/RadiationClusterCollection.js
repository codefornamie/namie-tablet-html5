/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RadiationClusterModel = require("modules/model/radiation/RadiationClusterModel");
    var Equal = require("modules/util/filter/Equal");
    var Code = require("modules/util/Code");
    var Or = require("modules/util/filter/Or");
    var IsNull = require("modules/util/filter/IsNull");
    var And = require("modules/util/filter/And");

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
                    top : 10000,
                    orderby : "startDate desc"
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
                    maxValue : cluster.maxValue / Math.pow(10, 3),
                    minValue : cluster.minValue / Math.pow(10, 3)
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
         * 役場で登録した車載線量計データのclusterの検索条件設定を行う
         * @memberOf RadiationClusterCollection#
         */
        setSearchConditionByMunicipality : function() {
            this.condition.filters = [
                    new Equal("measurementType", Code.RAD_MEASUREMENT_MUNICIPALITY), new IsNull("deletedAt")
            ];
        },

        /**
         * 車載または自身がアップロードしたclusterの検索条件設定を行う
         * @memberOf RadiationClusterCollection#
         */
        setSearchConditionByMunicipalityOrByMyself : function() {
            this.condition.filters = [
                new And([
                    new Or([
                        new Equal("measurementType", Code.RAD_MEASUREMENT_MUNICIPALITY),
                        new Equal("userId", app.user.get("__id"))
                    ]),
                    new IsNull("deletedAt")
                ])
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

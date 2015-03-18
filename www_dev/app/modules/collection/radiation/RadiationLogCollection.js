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

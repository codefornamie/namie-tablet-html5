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
    var leaflet = require("leaflet");
    var d3 = require("d3");

    /**
     * 地図情報ユーティリティクラス
     * @memberOf GeoUtil#
     */
    var GeoUtil = function() {
    };

    /**
     * 緯度経度をピクセルに変換する
     *
     * @memberOf GeoUtil#
     * @param {Leaflet.Map} map
     * @param {Array} x
     * @return {Array}
     */
    GeoUtil.project = function (map, x) {
        var point = map.latLngToLayerPoint(new leaflet.LatLng(x[1], x[0]));
        return [point.x, point.y];
    };

    /**
     * generateClassNameByDose
     *
     * @memberOf GeoUtil#
     * @param {Number} dose - ナノシーベルト毎時の値が来る
     * @return {String}
     */
    GeoUtil.generateClassNameByDose = function (dose) {
        var index;

        if (dose < 0.1) {
            index = 1;
        } else if (dose <= 0.2) {
            index = 2;
        } else if (dose <= 0.5) {
            index = 3;
        } else if (dose <= 1.0) {
            index = 4;
        } else if (dose <= 1.9) {
            index = 5;
        } else if (dose <= 3.8) {
            index = 6;
        } else if (dose <= 9.5) {
            index = 7;
        } else if (dose <= 19) {
            index = 8;
        } else if (19 < dose) {
            index = 9;
        }

        return "map-marker--" + index;
    };

    /**
     * computeBounds
     *
     * @param {Leaflet.Map} map
     * @param {Object} featureCollection - GeoJSONのFeatureCollection形式のオブジェクト
     * @return {Array} D3のboundsの形式
     */
    GeoUtil.computeBounds = function (map, featureCollection) {
        var transform = d3.geo.transform({
            point : function (x, y) {
                var point = map.latLngToLayerPoint(new leaflet.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
        });
        var path = d3.geo.path().projection(transform);
        var bounds = path.bounds(featureCollection);

        return bounds;
    };

    module.exports = GeoUtil;
});

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
     * generateColorByDose
     *
     * @memberOf GeoUtil#
     * @param {Number} dose - ナノシーベルト毎時の値が来る
     * @return {String}
     */
    GeoUtil.generateColorByDose = function (dose) {
        var col;

        if (dose < 0.1) {
            col = "#0b24e5";
        } else if (dose <= 0.2) {
            col = "#357ce7";
        } else if (dose <= 0.5) {
            col = "#25bfe9";
        } else if (dose <= 1.0) {
            col = "#18d381";
        } else if (dose <= 1.9) {
            col = "#16b23a";
        } else if (dose <= 3.8) {
            col = "#a5cd05";
        } else if (dose <= 9.5) {
            col = "#ebc323";
        } else if (dose <= 19) {
            col = "#ec881c";
        } else if (19 < dose) {
            col = "#ff0a21";
        }

        return col;
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

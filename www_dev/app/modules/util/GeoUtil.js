define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var leaflet = require("leaflet");

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

    module.exports = GeoUtil;
});

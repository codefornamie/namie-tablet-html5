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
     * @param {Leaflet.Map} map
     * @param {Array} x
     * @return {Array}
     */
    GeoUtil.project = function (map, x) {
        var point = map.latLngToLayerPoint(new leaflet.LatLng(x[1], x[0]));
        return [point.x, point.y];
    };

    module.exports = GeoUtil;
});

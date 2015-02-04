define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var leaflet = require("leaflet");
    var d3 = require("d3");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 放射線アプリの地図を表示するためのView
     *
     * @class 放射線アプリの地図を表示するためのView
     * @exports RadMapView
     * @constructor
     */
    var RadMapView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         */
        template : require("ldsh!templates/rad/top/map"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf RadMapView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadMapView#
         */
        afterRendered : function() {
            var URL_DUMMY_JSON = "http://www.json-generator.com/api/json/get/cpuAwBZPaW";

            // create a map in the "map" div, set the view to a given place and zoom
            var map = leaflet.map('map').setView([38, 140], 13);

            // add an OpenStreetMap tile layer
            leaflet.tileLayer(
                'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }
            ).addTo(map);

            var svg = d3.select(map.getPanes().overlayPane).append("svg");

            svg.attr({
                "width": 10000,
                "height": 10000
            });

            var g = svg.append("g").attr("class", "leaflet-zoom-hide");

            $.get(URL_DUMMY_JSON).done(function (data) {
                var putMarker = function (lat, lng, μSv) {
                    var marker = leaflet.marker([lat, lng]);
                    var circle = leaflet.circle([lat, lng], 1000);

                    marker.addTo(map);
                    marker.bindPopup(μSv + "μSv");

                    circle.addTo(map);
                };

                var circle = g.selectAll("circle")
                    .data(data);

                circle.enter()
                    .append("circle")
                    .attr({
                        "stroke": "#f00",
                        "stroke-width": 2,
                        "opacity": 0.7,
                        "fill": "#ff0",
                        "r": 20
                    });

                circle.exit()
                    .remove();

                var update = function () {
                    circle
                        .attr("transform", function (d) {
                            return "translate(" +
                                map.latLngToLayerPoint(d.latLngObj).x + "," +
                                map.latLngToLayerPoint(d.latLngObj).y + ")";
                        });
                };

                data.forEach(function (radLog) {
                    var lat = parseInt(radLog.latitude, 10) / Math.pow(10, 6);
                    var lng = parseInt(radLog.longitude, 10) / Math.pow(10, 6);
                    var μSv = parseInt(radLog.value, 10) / 1000;

                    putMarker(lat, lng, μSv);

                    radLog.latLngObj = new leaflet.LatLng(lat, lng);
                });

                // TODO: fit svg bounds

                map.on("viewreset", update);
                update();
            });
        },

        /**
         * 初期化
         * @memberOf RadMapView#
         */
        initialize : function() {
            // ローディングを開始
            this.showLoading();

            this.initCollection();
            this.initEvents();

            // ローディングを停止
            this.hideLoading();
        },

        /**
         * collectionを初期化する
         * @memberOf RadMapView#
         */
        initCollection : function () {
        },

        /**
         * イベントを初期化する
         * @memberOf RadMapView#
         */
        initEvents : function() {
        }
    });

    module.exports = RadMapView;
});

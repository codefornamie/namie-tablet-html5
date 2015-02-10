define(function(require, exports, module) {
    "use strict";

    //var app = require("app");
    //var async = require("async");
    var leaflet = require("leaflet");
    var d3 = require("d3");
    //var GeoUtil = require("modules/util/GeoUtil");
    var AbstractView = require("modules/view/AbstractView");
    var RadMapLayerView = require("modules/view/rad/top/RadMapLayerView");
    var RadiationClusterCollection = require("modules/collection/radiation/RadiationClusterCollection");

    /**
     * 放射線アプリの地図を表示するためのView
     *
     * @class 放射線アプリの地図を表示するためのView
     * @exports RadMapView
     * @constructor
     */
    var RadMapView = AbstractView.extend({
        manage : false,
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
        },

        /**
         * 地図にマッピングしているSVGのレイヤをレンダリングする
         * @memberOf RadMapView#
         */
        renderLayers : function () {
            var map, svg, container;

            this.initMap();
            this.initSVGLayer();

            map = this.map;
            svg = this.svg;
            container = this.container;

            this.layers.forEach(function (v) {
                v.setMap(map);
                v.setSVG(svg);
                v.setContainer(container);
                v.radiationLogCollection.fetch();
            });
        },

        /**
         * Leafletのマップを初期化する
         * @memberOf RadMapView#
         */
        initMap : function () {
            if (this.map) {
                return;
            }

            var map = leaflet.map("map").setView([38, 140], 13);

            leaflet.tileLayer(
                RadMapView.URL_TILE_SERVER,
                {
                    attribution : "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                }
            ).addTo(map);

            map.on("viewreset", this.fitBounds.bind(this));

            this.map = map;
        },

        /**
         * Leafletにオーバーラップさせるグラフのレイヤを初期化する
         * @memberOf RadMapView#
         */
        initSVGLayer : function () {
            console.assert(this.map, "should call initSVGLayer after initMap");

            var map = this.map;
            var svg = d3.select(map.getPanes().overlayPane).append("svg");
            var container;

            // TODO: fit svg bounds
            svg.attr({
                "width" : 10000,
                "height" : 10000
            });

            container = svg.append("g").attr("class", "leaflet-zoom-hide");

            this.svg = svg;
            this.container = container;
        },

        /**
         * 初期化
         * @memberOf RadMapView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be given");
            console.assert(param.radiationClusterCollection, "radiationClusterCollection should be specified");

            this.radiationClusterCollection = param.radiationClusterCollection;

            // ローディングを開始
            this.showLoading();

            this.layers = [];
            //this.initCollection();
            this.initEvents();

            //this.radiationClusterCollection.fetch();

            // ローディングを停止
            this.hideLoading();
        },

        /**
         * collectionを初期化する
         * @memberOf RadMapView#
         */
        initCollection : function () {
            //this.radiationClusterCollection = new RadiationClusterCollection();
        },

        /**
         * イベントを初期化する
         * @memberOf RadMapView#
         */
        initEvents : function() {
            this.listenTo(this.radiationClusterCollection, "request", this.onRequestCollection);
            this.listenTo(this.radiationClusterCollection, "add", this.onAddCollection);
            this.listenTo(this.radiationClusterCollection, "sync", this.onSyncCollection);
        },

        /**
         * SVG要素をマッピングされているデータにfitさせる
         * @memberOf RadMapView#
         */
        fitBounds : function () {
            var features = _(this.layers).map(function (v) {
                return v.radiationLogCollection.toGeoJSON().features;
            }).flatten(true).value();
            var data = {
                "type" : "FeatureCollection",
                "features" : features
            };
            var map = this.map;
            var transform = d3.geo.transform({
                point : function (x, y) {
                    var point = map.latLngToLayerPoint(new leaflet.LatLng(y, x));
                    this.stream.point(point.x, point.y);
                }
            });
            var path = d3.geo.path().projection(transform);
            var bounds = path.bounds(data);
            var topLeft = bounds[0];
            var bottomRight = bounds[1];

            var AREA_MARGIN = 100;

            this.svg
                .attr("width", bottomRight[0] - topLeft[0] + AREA_MARGIN * 2)
                .attr("height", bottomRight[1] - topLeft[1] + AREA_MARGIN * 2)
                .style("left", topLeft[0] - AREA_MARGIN + "px")
                .style("top", topLeft[1] - AREA_MARGIN + "px");

            this.container.attr("transform", "translate(" + (-topLeft[0] + AREA_MARGIN) + "," + (-topLeft[1] + AREA_MARGIN) + ")");
        },

        /**
         * コレクションが読み込み開始したら呼ばれる
         * @memberOf RadMapView#
         */
        onRequestCollection : function () {
            this.layers.length = 0;
        },

        /**
         * コレクションが変化したら呼ばれる
         * @memberOf RadMapView#
         */
        onAddCollection : function (model) {
            var layerView = new RadMapLayerView({
                radiationClusterModel : model
            });

            this.layers.push(layerView);
        },

        /**
         * コレクションが読み込み完了したら呼ばれる
         * @memberOf RadMapView#
         */
        onSyncCollection : function () {
            this.renderLayers();
        }
    }, {
        /**
         * タイルサーバのURL
         */
        URL_TILE_SERVER : "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    });

    module.exports = RadMapView;
});

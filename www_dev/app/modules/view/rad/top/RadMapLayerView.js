define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var leaflet = require("leaflet");
    var d3 = require("d3");
    var GeoUtil = require("modules/util/GeoUtil");
    var AbstractView = require("modules/view/AbstractView");
    var RadiationLogCollection = require("modules/collection/radiation/RadiationLogCollection");

    /**
     * 放射線アプリの地図のレイヤ
     *
     * @class 放射線アプリの地図のレイヤ
     * @exports RadMapLayerView
     * @constructor
     */
    var RadMapLayerView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         */
        template : null,

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf RadMapLayerView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadMapLayerView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化
         * @memberOf RadMapLayerView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be given");
            console.assert(param.radiationClusterModel, "radiationClusterModel should be specified");

            this.radiationClusterModel = param.radiationClusterModel;

            this.initCollection();
            this.initEvents();

            //this.radiationLogCollection.fetch();
        },

        /**
         * radiationClusterModelを元にradiationLogCollectionを初期化する
         * @memberOf RadMapLayerView#
         */
        initCollection : function () {
            this.radiationLogCollection = new RadiationLogCollection({
                __id : this.radiationClusterModel.get("collectionId")
            });
        },

        /**
         * イベントを初期化する
         * @memberOf RadMapLayerView#
         */
        initEvents : function() {
            this.listenTo(this.radiationLogCollection, "request", this.onRequestCollection);
            this.listenTo(this.radiationLogCollection, "add", this.onAddCollection);
            this.listenTo(this.radiationLogCollection, "sync", this.onSyncCollection);
        },

        /**
         * draw
         *
         * @return {undefined}
         */
        draw : function () {
            console.assert(this.map, "should call setMap before drawing");
            console.assert(this.container, "should call setContainer before drawing");

            var map = this.map;
            var svg = this.svg;
            var container = this.container;
            var data = this.radiationLogCollection.toGeoJSON();
            var transform = d3.geo.transform({
                point : function (x, y) {
                    var point = map.latLngToLayerPoint(new leaflet.LatLng(y, x));

                    this.stream.point(point.x, point.y);
                }
            });
            var path = d3.geo.path().projection(transform);

            var circle = container.selectAll("circle").data(data.features);

            circle.enter()
                .append("circle")
                .attr({
                    "stroke" : "#f00",
                    "stroke-width" : 2,
                    "opacity" : 0.7,
                    "fill" : "#ff0",
                    "r" : 20
                });

            circle.exit()
                .remove();

            var update = function () {
                var bounds = path.bounds(data);
                var topLeft = bounds[0];
                var bottomRight = bounds[1];

                var AREA_MARGIN = 300;

                svg
                    .attr("width", bottomRight[0] - topLeft[0] + AREA_MARGIN * 2)
                    .attr("height", bottomRight[1] - topLeft[1] + AREA_MARGIN * 2)
                    .style("left", topLeft[0] - AREA_MARGIN + "px")
                    .style("top", topLeft[1] - AREA_MARGIN + "px");

                container.attr("transform", "translate(" + (-topLeft[0] + AREA_MARGIN) + "," + (-topLeft[1] + AREA_MARGIN) + ")");

                circle
                    .attr("transform", function (d) {
                        var x = GeoUtil.project(map, d.geometry.coordinates)[0];
                        var y = GeoUtil.project(map, d.geometry.coordinates)[1];

                        return "translate(" + x + "," + y + ")";
                    });
            };

            var putMarker = function (lat, lng, μSv) {
                var m = leaflet.marker([lat, lng]);
                var c = leaflet.circle([lat, lng], 1000);

                m.addTo(map);
                m.bindPopup(μSv + "μSv");

                c.addTo(map);
            };

            data.features.forEach(function (feature) {
                var coords = feature.geometry.coordinates;
                var props = feature.properties;

                var lat = coords[0];
                var lng = coords[1];
                var μSv = props.value;

                putMarker(lat, lng, μSv);
            });

            map.on("viewreset", update);
            update();
        },

        /**
         * Viewを表示する
         *
         * @memberOf RadMapLayerView#
         */
        show : function () {
        },

        /**
         * Viewを非表示にする
         *
         * @memberOf RadMapLayerView#
         */
        hide : function () {
        },

        /**
         * Viewがレンダリングされる先のmapをsetする
         * @memberOf RadMapLayerView#
         * @param {Leaflet.Map} map
         */
        setMap : function (map) {
            this.map = map;
        },

        /**
         * Viewがレンダリングされる先のsvgをsetする
         * @memberOf RadMapLayerView#
         * @param {D3.Selection} svg
         */
        setSVG : function (svg) {
            this.svg = svg;
        },

        /**
         * Viewがレンダリングされる先のcontainerをsetする
         * @memberOf RadMapLayerView#
         * @param {D3.Selection} container
         */
        setContainer : function (container) {
            this.container = container;
        },

        /**
         * コレクションが読み込み開始したら呼ばれる
         * @memberOf RadMapLayerView#
         */
        onRequestCollection : function () {
        },

        /**
         * コレクションが変化したら呼ばれる
         * @memberOf RadMapLayerView#
         */
        onAddCollection : function (model) {
        },

        /**
         * コレクションが読み込み完了したら呼ばれる
         * @memberOf RadMapLayerView#
         */
        onSyncCollection : function () {
            this.draw();
        }
    });

    module.exports = RadMapLayerView;
});

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
            var container = this.container;
            var data = this.radiationLogCollection.toGeoJSON();

            var putMarker = function (lat, lng, μSv) {
                var m = leaflet.marker([lat, lng]);
                var c = leaflet.circle([lat, lng], 1000);

                m.addTo(map);
                m.bindPopup(μSv + "μSv");

                c.addTo(map);
            };

            var circle = container.selectAll("circle")
                .data(data);

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
                circle
                    .attr("transform", function (d) {
                        return "translate(" +
                            map.latLngToLayerPoint(d.latLngObj).x + "," +
                            map.latLngToLayerPoint(d.latLngObj).y + ")";
                    });
            };
            // TODO:
            return;

            data.features.forEach(function (radLog) {
                var lat = parseInt(radLog.latitude, 10) / Math.pow(10, 6);
                var lng = parseInt(radLog.longitude, 10) / Math.pow(10, 6);
                var μSv = parseInt(radLog.value, 10) / 1000;

                putMarker(lat, lng, μSv);

                radLog.latLngObj = new leaflet.LatLng(lat, lng);
            });

            // TODO: fit svg bounds

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

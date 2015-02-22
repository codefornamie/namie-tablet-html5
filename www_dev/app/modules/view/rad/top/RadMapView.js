define(function(require, exports, module) {
    "use strict";

    var leaflet = require("leaflet");
    var AbstractView = require("modules/view/AbstractView");
    var RadMapLayerView = require("modules/view/rad/top/RadMapLayerView");

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
        },

        /**
         * 各レイヤを初期化する
         * @memberOf RadMapView#
         */
        renderLayers : function () {
            var map = this.initMap();

            this.layers.forEach(function (v) {
                v.setMap(map);
            });
        },

        /**
         * Leafletのマップを初期化する
         * @memberOf RadMapView#
         * @return {leaflet.Map}
         */
        initMap : function () {
            if (this.map) {
                return this.map;
            }

            var map = leaflet.map("map", {
                zoomControl : false
            });

            map.on("load", this.onLoadMap.bind(this));

            map.addControl(leaflet.control.zoom({
                position : "bottomright"
            }));

            leaflet.tileLayer(
                RadMapView.URL_TILE_SERVER,
                {
                    attribution : "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                }
            ).addTo(map);

            map.setView([38, 140], 13);

            this.map = map;

            return this.map;
        },

        /**
         * viewを初期化する
         * @memberOf RadMapView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be given");
            console.assert(param.radiationClusterCollection, "radiationClusterCollection should be specified");

            // ローディングを開始
            this.showLoading();

            this.radiationClusterCollection = param.radiationClusterCollection;
            this.layers = [];
            this.initEvents();

            // ローディングを停止
            this.hideLoading();
        },

        /**
         * イベントを初期化する
         * @memberOf RadMapView#
         */
        initEvents : function() {
            this.listenTo(this.radiationClusterCollection, "change:hidden", this.onChangeClusterModel);
            this.listenTo(this.radiationClusterCollection, "request", this.onRequestCollection);
            this.listenTo(this.radiationClusterCollection, "add", this.onAddCollection);
            this.listenTo(this.radiationClusterCollection, "sync", this.onSyncCollection);
        },

        /**
         * 地図に描画するマーカーの座標を持つFeatureCollectionを返す
         * @memberOf RadMapView#
         * @return {Object}
         */
        generateFeatureCollection : function () {
            var features = _(this.layers).map(function (v) {
                return v.radiationLogCollection.toGeoJSON().features;
            }).flatten(true).value();

            var featureCollection = {
                "type" : "FeatureCollection",
                "features" : features
            };

            return featureCollection;
        },

        /**
         * 地図が初期化されたらサイドバーを表示する
         * @memberOf RadMapView#
         */
        onLoadMap : function () {
            this.$el.trigger("sidebar.show");
        },

        /**
         * あるClusterModelが表示されたら、それ以外は非表示とする
         * @memberOf RadMapView#
         * @param {RadiationClusterModel} model
         */
        onChangeClusterModel : function (model) {
            if (model.get("hidden")) {
                return;
            }

            this.layers.forEach(function (layerView) {
                if (layerView.radiationClusterModel.cid === model.cid) {
                    return;
                }

                layerView.radiationClusterModel.set(
                    {
                        hidden : true
                    }
                );
            });
        },

        /**
         * Collectionが読み込み開始したら、レイヤは全て破棄する
         * @memberOf RadMapView#
         */
        onRequestCollection : function () {
            this.layers.forEach(function (layerView) {
                layerView.remove();
            });

            this.layers.length = 0;
        },

        /**
         * ClusterModelが追加されたら、レイヤを生成する
         * @memberOf RadMapView#
         * @param {RadiationClusterModel} model
         */
        onAddCollection : function (model) {
            var layerView = new RadMapLayerView({
                radiationClusterModel : model
            });

            this.layers.push(layerView);
        },

        /**
         * Collectionが読み込み完了したら、各レイヤを初期化する
         * @memberOf RadMapView#
         */
        onSyncCollection : function () {
            this.renderLayers();
        }
    }, {
        /**
         * タイルサーバのURL
         * @memberOf RadMapView
         */
        URL_TILE_SERVER : "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    });

    module.exports = RadMapView;
});

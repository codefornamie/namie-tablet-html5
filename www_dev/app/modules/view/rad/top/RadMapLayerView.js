define(function(require, exports, module) {
    "use strict";

    var leaflet = require("leaflet");
    var d3 = require("d3");
    var GeoUtil = require("modules/util/GeoUtil");
    var AbstractView = require("modules/view/AbstractView");
    var RadPopupView = require("modules/view/rad/top/RadPopupView");
    var RadiationLogCollection = require("modules/collection/radiation/RadiationLogCollection");

    require("leaflet.markercluster");

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
         * 初期化
         * @memberOf RadMapLayerView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be given");
            console.assert(param.radiationClusterModel, "radiationClusterModel should be specified");

            this.isHidden = false;
            this.radiationClusterModel = param.radiationClusterModel;

            this.initEvents();
        },

        /**
         * radiationClusterModelを元にradiationLogCollectionを初期化する
         * @memberOf RadMapLayerView#
         * @param {Function} callback
         */
        initCollection : function (callback) {
            // Collectionが読込済であればコールバックを呼ぶ
            if (this.radiationLogCollection) {
                if (callback) {
                    callback(null);
                }
                return;
            }

            // radiation_clusterに紐づくradiation_logを読み込む
            this.radiationLogCollection = new RadiationLogCollection({
                __id : this.radiationClusterModel.get("collectionId")
            });
            this.radiationLogCollection.collectionId = this.radiationClusterModel.get("__id");
            this.radiationLogCollection.setSearchConditionIncludeInCluster();

            this.listenTo(this.radiationLogCollection, "request", this.onRequestCollection);
            this.listenTo(this.radiationLogCollection, "add", this.onAddCollection);
            this.listenTo(this.radiationLogCollection, "sync", this.onSyncCollection);

            this.radiationLogCollection
                .fetch()
                .then(callback);
        },

        /**
         * イベントを初期化する
         * @memberOf RadMapLayerView#
         */
        initEvents : function() {
            this.listenTo(this.radiationClusterModel, "change:hidden", this.onChangeClusterModel);
        },

        /**
         * 地図にマーカーを描画する
         *
         * @memberOf RadMapLayerView#
         */
        draw : function () {
            console.assert(this.map, "should call setMap before drawing");

            var self = this;
            var markerClusters = this.markerClusters;

            this.radiationLogCollection.each(function(model) {
                var marker = leaflet.geoJson(model.toGeoJSON(), {
                    pointToLayer : self.pointToLayer.bind(self)
                });

                marker.on("click", self.onMarkerClick.bind(self));

                markerClusters.addLayer(marker);
            });

            this.map.fitBounds(markerClusters.getBounds());
        },

        /**
         * マーカーを生成する
         *
         * @memberOf RadMapLayerView#
         * @param {Object} feature
         * @param {leaflet.LatLng} latLng
         * @return {leaflet.Marker}
         */
        pointToLayer : function(feature, latLng) {
            var iconDim = 20;
            var html, icon, marker;
            var $iconRoot = $("<div>");
            var $container = $("<div>", {
                "class" : "layer-" + this.cid
            }).appendTo($iconRoot);
            var container = d3.select($container[0])
                .attr("width", iconDim)
                .attr("height", iconDim);

            container.append("div")
                .style({
                    "width" : iconDim + "px",
                    "height" : iconDim + "px",
                    "border-radius" : "50%"
                })
                .attr({
                    "class" : function() {
                        var value = feature.properties.value;

                        return [
                            "marker__circle",
                            GeoUtil.generateClassNameByDose(value)
                        ].join(" ");
                    }
                });

            html = $iconRoot.html();
            icon = new leaflet.DivIcon({
                html : html,
                className : "marker",
                iconSize : new leaflet.Point(iconDim, iconDim)
            });

            marker = leaflet.marker(latLng, {
                icon : icon
            });

            return marker;
        },

        /**
         * クラスタのアイコンを生成する
         *
         * @memberOf RadMapLayerView#
         * @param {Object} cluster
         * @return {leaflet.DivIcon}
         */
        defineClusterIcon : function(cluster) {
            var iconDim = 40;
            var html, icon;
            var $iconRoot = $("<div>");
            var $container = $("<div>", {
                "class" : "layer-" + this.cid
            }).appendTo($iconRoot);
            var container = d3.select($container[0])
                .attr("width", iconDim)
                .attr("height", iconDim);

            container.append("div")
                .style({
                    "width" : iconDim + "px",
                    "height" : iconDim + "px",
                    "border-radius" : "50%"
                })
                .attr({
                    "class" : function() {
                        var valueTotal = 0;

                        _(cluster.getAllChildMarkers()).each(function(marker) {
                            valueTotal += marker.feature.properties.value;
                        });

                        return [
                            "marker-cluster__circle",
                            GeoUtil.generateClassNameByDose(valueTotal / cluster.getChildCount())
                        ].join(" ");
                    }
                });

            html = $iconRoot.html();
            icon = new leaflet.DivIcon({
                html : html,
                className : "marker-cluster",
                iconSize : new leaflet.Point(iconDim, iconDim)
            });

            return icon;
        },

        /**
         * Viewを表示する
         *
         * @memberOf RadMapLayerView#
         */
        show : function () {
            if (this.isHidden === false) {
                this.map.addLayer(this.markerClusters);
                return;
            }

            // 1. collectionが読み込まれていなければ読み込む
            // 2. マーカーが画面内に収まるように表示領域を自動調整する
            this.showLoading();
            this.initCollection(function () {
                this.hideLoading();

                var clusterBounds = this.markerClusters.getBounds();
                this.map.fitBounds(clusterBounds);

                this.map.addLayer(this.markerClusters);
            }.bind(this));

            this.isHidden = false;
        },

        /**
         * Viewを非表示にする
         *
         * @memberOf RadMapLayerView#
         */
        hide : function () {
            this.map.removeLayer(this.markerClusters);
            this.isHidden = true;
        },

        /**
         * viewの表示/非表示を切り替える
         * @memberOf RadMapLayerView#
         */
        toggle : function () {
            if (this.isHidden) {
                this.show();
            } else {
                this.hide();
            }
        },

        /**
         * 表示状態が反映されていないマーカー(例: viewが非表示中に追加されたマーカーなど)を
         * 適切な表示状態に更新する
         * @memberOf RadMapLayerView#
         */
        updateVisibility : function () {
            if (this.isHidden) {
                this.hide();
            } else {
                this.show();
            }
        },

        /**
         * Viewがレンダリングされる先のmapをsetするsetterメソッド
         * 各ズームレベル毎のクラスター半径を返す
         * @memberOf RadMapLayerView#
         * @param {Number} zoom
         */
        defineMaxClusterRadius : function (zoom) {
            var radius = 80;
            console.log("zoom: " + zoom + ", radius: " + radius);
            return radius;
        },

        /**
         * Viewがレンダリングされる先のmapをsetする
         * @memberOf RadMapLayerView#
         * @param {Leaflet.Map} map
         */
        setMap : function (map) {
            this.map = map;

            this.markerClusters = new leaflet.MarkerClusterGroup({
                showCoverageOnHover : false,
                zoomToBoundsOnClick : false,
                animateAddingMarkers : true,
                maxClusterRadius : this.defineMaxClusterRadius,
                disableClusteringAtZoom : this.map.getMaxZoom(),
                iconCreateFunction : this.defineClusterIcon.bind(this)
            });

            this.map.addLayer(this.markerClusters);

            // event:
            // クラスタがクリックされたら吹き出しを表示する
            this.markerClusters.on("clusterclick", this.onClusterClick.bind(this));

            // event:
            // 地図移動によりマーカーが再描画されるため、表示状態を更新する
            this.map.on("moveend", this.updateVisibility.bind(this));
        },

        /**
         * radiationClusterModelが変更されたら呼ばれる
         * @memberOf RadMapLayerView#
         */
        onChangeClusterModel : function () {
            var isHidden = this.radiationClusterModel.get("hidden");

            if (isHidden) {
                this.hide();
            } else {
                this.show();
            }
        },

        /**
         * コレクションが読み込み完了したら呼ばれる
         * @memberOf RadMapLayerView#
         */
        onSyncCollection : function () {
            this.draw();
        },

        /**
         * クラスタがクリックされたら呼ばれる
         * @memberOf RadMapLayerView#
         * @param {Object} ev
         */
        onClusterClick : function (ev) {
            var markers = ev.layer.getAllChildMarkers();
            var features = _.pluck(markers, "feature");
            var fcol = {
                "type" : "FeatureCollection",
                "features" : features
            };

            var popupView = new RadPopupView({
                data : {
                    radiationClusterModel : this.radiationClusterModel,
                    radiationClusterFeature : this.radiationClusterModel.toGeoJSON(),
                    radiationLogFeatureCollection : fcol
                },

                position : ev.latlng
            });

            popupView.setMap(this.map);
            popupView.show();
        },

        /**
         * マーカーがクリックされたら呼ばれる
         * @memberOf RadMapLayerView#
         * @param {Object} ev
         */
        onMarkerClick : function (ev) {
            var marker = ev.layer;

            var popupView = new RadPopupView({
                data : {
                    radiationClusterFeature : this.radiationClusterModel.toGeoJSON(),
                    radiationLogFeatureCollection : null,
                    radiationLogFeature : marker.feature
                },

                position : ev.latlng
            });

            popupView.setMap(this.map);
            popupView.show();
        }
    });

    module.exports = RadMapLayerView;
});

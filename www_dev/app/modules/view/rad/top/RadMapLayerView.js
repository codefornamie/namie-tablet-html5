define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var leaflet = require("leaflet");
    var leafletMarkerCluster = require("leaflet.markercluster");
    var d3 = require("d3");
    var GeoUtil = require("modules/util/GeoUtil");
    var AbstractView = require("modules/view/AbstractView");
    var RadPopupView = require("modules/view/rad/top/RadPopupView");
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

            this.isHidden = false;
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
            this.listenTo(this.radiationClusterModel, "change:hidden", this.onChangeClusterModel);
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
            var markerClusters = this.markerClusters;

            this.radiationLogCollection.each(function(model) {
                var marker = leaflet.geoJson(model.toGeoJSON());

                markerClusters.addLayer(marker);
            });
        },

        /**
         * defineClusterIcon
         *
         * @return {leaflet.DivIcon}
         */
        defineClusterIcon : function(cluster) {
            var self = this;
            var iconDim = 40;
            var html, icon;
            //var containerElement = document.createElementNS(d3.ns.prefix.svg, 'svg');
            var containerElement = document.createElement("div");
            var container = d3.select(containerElement)
                .attr("width", 40)
                .attr("height", 40);

            container.append("div")
                .style({
                    "width" : "40px",
                    "height" : "40px",
                    "border-radius" : "50%"
                })
                .attr({
                    "class" : function(d) {
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

            container.append("span")
                .attr({
                    "class" : "marker-cluster__text"
                })
                .text(cluster.getChildCount());

            html = $(containerElement).html();
            icon = new leaflet.DivIcon({
                html : html,
                className : "marker-cluster",
                iconSize : new leaflet.Point(iconDim, iconDim)
            });

            return icon;
        },

        /**
         * serializeXmlNode
         *
         * @memberOf RadMapLayerView#
         */
        serializeXmlNode : function(xmlNode) {
            if (typeof window.XMLSerializer != "undefined") {
                return (new window.XMLSerializer()).serializeToString(xmlNode);
            } else if (typeof xmlNode.xml != "undefined") {
                return xmlNode.xml;
            }
            return "";
        },

        /**
         * Viewを表示する
         *
         * @memberOf RadMapLayerView#
         */
        show : function () {
            $(".layer-" + this.cid).show();
            this.isHidden = false;
        },

        /**
         * Viewを非表示にする
         *
         * @memberOf RadMapLayerView#
         */
        hide : function () {
            $(".layer-" + this.cid).hide();
            this.isHidden = true;
        },

        /**
         * toggle
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
         * Viewがレンダリングされる先のmapをsetする
         * @memberOf RadMapLayerView#
         * @param {Leaflet.Map} map
         */
        setMap : function (map) {
            var self = this;

            this.map = map;

            this.markerClusters = new leaflet.MarkerClusterGroup({
                showCoverageOnHover : false,
                zoomToBoundsOnClick : false,
                animateAddingMarkers : true,
                maxClusterRadius : 80,
                iconCreateFunction : this.defineClusterIcon.bind(this)
            });

            this.markerClusters.on("clusterclick", this.onClusterClick.bind(this));

            map.addLayer(this.markerClusters);
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
         * onChangeClusterModel
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
        },

        /**
         * onClusterClick
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
                    radiationClusterFeature : this.radiationClusterModel.toGeoJSON(),
                    radiationLogFeatureCollection : fcol
                },

                position : ev.latlng
            });

            popupView.setMap(this.map);
            popupView.show();
        }
    });

    module.exports = RadMapLayerView;
});

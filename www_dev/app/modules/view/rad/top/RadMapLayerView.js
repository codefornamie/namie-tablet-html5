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
/*
            var container = this.container;
            var data = [{
                radiationClusterModel : this.radiationClusterModel,
                radiationLogCollection : this.radiationLogCollection
            }];

            var circle = container.selectAll("circle.layer-" + this.cid).data(data);

            circle.enter()
                .append("circle")
                .attr({
                    "opacity" : 0.9,
                    "r" : 10,
                    "class" : function (d) {
                        var feature = d.radiationClusterModel.toGeoJSON();
                        var maxValue = feature.properties.maxValue;

                        return [
                                "leaflet-clickable",
                                "layer-" + this.cid,
                                GeoUtil.generateClassNameByDose(maxValue)
                        ].join(" ");
                    }.bind(this)
                })
                .each(function (d) {
                    var popupView = new RadPopupView({
                        origin : this,
                        data : d,
                        map : map
                    });
                });

            circle.exit()
                .remove();

            var update = function () {
                circle
                    .attr("transform", function (d) {
                        var feature = d.radiationClusterModel.toGeoJSON();
                        var x = GeoUtil.project(map, feature.geometry.coordinates)[0];
                        var y = GeoUtil.project(map, feature.geometry.coordinates)[1];

                        return "translate(" + x + "," + y + ")";
                    });
            };

            map.on("viewreset", update);
            update();
*/
            var layerView = this;
            this.radiationLogCollection.each(function(model) {
                var marker = leaflet.geoJson(model.toGeoJSON());
                marker.layerView = layerView;
                markerClusters.addLayer(marker);
            });
        },

        /**
         * defineClusterIcon
         *
         * @return {leaflet.DivIcon}
         */
        defineClusterIcon : function(cluster) {
/*
            var markers = cluster.getAllChildMarkers();
            var n = 0;
            for (var i = 0; i < markers.length; i++) {
            n += markers[i].value;
            }
            return leaflet.divIcon({ html: n, className: 'mycluster', iconSize: leaflet.point(40, 40) });
*/

            //Create an svg element
            var svgElement = document.createElementNS(d3.ns.prefix.svg, 'svg');

            var svg = d3.select(svgElement).attr("width",40).attr("height",40);
            svg.append("circle")
                .attr({
                    "cx": 20,
                    "cy": 20,
                    "r": 20,
                    "class": function(d) {
                        var valueTotal = 0;
                        _(cluster.getAllChildMarkers()).each(function(marker) {
                            valueTotal += marker.feature.properties.value;
                        });
                        return GeoUtil.generateClassNameByDose(valueTotal / cluster.getChildCount());
                    }
                });
            svg.append("text")
                .text(cluster.getChildCount())
                .attr({
                    "x": 20,
                    "y": 20,
                    "dy": ".3em",
                    "text-anchor": "middle",
                    "font-weight": "bold",
                    "font-size": "1rem",
                    "fill": "white"
                });

            var html = this.serializeXmlNode(svgElement);

            var iconDim = 40;
            var myIcon = new leaflet.DivIcon({
                html: html,
                className: 'marker-cluster', 
                iconSize: new leaflet.Point(iconDim, iconDim)
            });

            return myIcon;
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
            this.map = map;

            this.markerClusters = new leaflet.MarkerClusterGroup({
                maxClusterRadius: 40,
                iconCreateFunction: this.defineClusterIcon.bind(this)
            });

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
        }
    });

    module.exports = RadMapLayerView;
});

define(function(require, exports, module) {
    "use strict";

    var Code = require("modules/util/Code");
    var moment = require("moment");
    var leaflet = require("leaflet");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 放射線アプリの地図のレイヤ
     *
     * @class 放射線アプリの地図のレイヤ
     * @exports RadPopupView
     * @constructor
     */
    var RadPopupView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         */
        template : require("ldsh!templates/rad/top/popup"),

        /**
         * レンダリングに利用するオブジェクトを作成する
         *
         * @memberOf RadPopupView#
         * @return {Object}
         */
        serialize : function () {
            var clusterFeature = this.radiationClusterFeature;
            var logFeatureCollection = this.radiationLogFeatureCollection;
            var logFeature = this.radiationLogFeature;

            var hasCollection = !!logFeatureCollection;
            var date, dateStr, avg, max , min;
            var stationType, numSample, sensorVendor, sensorModel;
            var hasErrDoseMissing;

            if (hasCollection) {
                date = moment(clusterFeature.properties.startDate);
                dateStr = date.isValid() ? date.format("YYYY年 M/D(ddd)") : "--";
                avg = logFeatureCollection.features.reduce(function (total, feature) {
                    return total + feature.properties.value;
                }, 0) / logFeatureCollection.features.length;
                max = _.max(logFeatureCollection.features, function (feature) {
                    return feature.properties.value;
                }).properties.value;
                min = _.min(logFeatureCollection.features, function (feature) {
                    return feature.properties.value;
                }).properties.value;
                hasErrDoseMissing = _.some(logFeatureCollection.features, function (feature) {
                    return feature.properties.errorCode & Code.ERR_DOSE_MISSING;
                });
                numSample = logFeatureCollection.features.length;

                // 小数点以下3桁に丸める
                avg = Math.round(avg * 1000) / 1000;
            } else {
                date = moment(logFeature.properties.date);
                dateStr = date.isValid() ? date.format("YYYY年 M/D(ddd) H時mm分") : "--";
                avg = logFeature.properties.value;
                max = logFeature.properties.value;
                hasErrDoseMissing = logFeature.properties.errorCode & Code.ERR_DOSE_MISSING;
                numSample = 1;
            }

            stationType = clusterFeature.properties.isFixedStation ? "固定局" : "移動局";
            sensorVendor = clusterFeature.properties.sensorVendor;
            sensorModel = clusterFeature.properties.sensorModel;

            return {
                data : {
                    dateStr : dateStr,
                    avg : avg,
                    max : max,
                    min : min,
                    stationType : stationType,
                    numSample : numSample,
                    sensorVendor : sensorVendor,
                    sensorModel : sensorModel,
                    hasErrDoseMissing : hasErrDoseMissing,
                    hasCollection : hasCollection
                }
            };
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf RadPopupView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadPopupView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化
         * @memberOf RadPopupView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be given");
            console.assert(param.position, "position should be specified");
            console.assert(param.data, "data should be specified");

            this.position = param.position;
            this.data = param.data;
            this.radiationClusterModel = this.data.radiationClusterModel;
            this.radiationClusterFeature = this.data.radiationClusterFeature;
            this.radiationLogFeatureCollection = this.data.radiationLogFeatureCollection;
            this.radiationLogFeature = this.data.radiationLogFeature;

            this.initEvents();

            this.popup = leaflet.popup()
                .setLatLng(this.position)
                .setContent(this.getContent());
        },

        /**
         * イベントを初期化する
         * @memberOf RadPopupView#
         */
        initEvents : function() {
            this.listenTo(this.radiationClusterModel, "change:hidden", this.onChangeClusterModel);
        },

        /**
         * Viewを表示する
         *
         * @memberOf RadPopupView#
         */
        show : function () {
            this.popup.openOn(this.map);
        },

        /**
         * Viewを非表示にする
         *
         * @memberOf RadPopupView#
         */
        hide : function () {
            this.map.closePopup(this.popup);
        },

        /**
         * Viewがレンダリングされる先のmapをsetする
         * @memberOf RadPopupView#
         * @param {Leaflet.Map} map
         */
        setMap : function (map) {
            this.map = map;
            this.map.once("popupopen", this.onPopupOpen.bind(this));
        },

        /**
         * ポップアップのcontentを取得する
         *
         * @memberOf RadPopupView#
         * @return {String}
         */
        getContent : function () {
            return this.template(this.serialize());
        },

        /**
         * ポップアップが表示されたら呼ばれる
         * @memberOf RadPopupView#
         * @param {Event} ev
         */
        onPopupOpen : function (ev) {
            this.el = ev.popup._contentNode;

            $(".rad-popup__info__more--button", this.el).one("click", this.onShowMore.bind(this));
        },

        /**
         * radiationClusterModelが変更されたら呼ばれる
         * @memberOf RadPopupView#
         */
        onChangeClusterModel : function () {
            var isHidden = this.radiationClusterModel.get("hidden");

            if (isHidden) {
                this.hide();
            }
        },

        /**
         * 「もっと見る」がクリックされたら呼ばれる
         * @memberOf RadPopupView#
         * @param {Event} ev
         */
        onShowMore : function (ev) {
            $(".rad-popup__info__more--button", this.el).hide();
            $(".rad-popup__info", this.el).show();
        },

        /**
         * origin要素がクリックされたら呼ばれる
         * @memberOf RadPopupView#
         */
        onClickOrigin : function () {
        }
    });

    module.exports = RadPopupView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RadiationLogModel = require("modules/model/radiation/RadiationLogModel");

    /**
     * 放射線量データのコレクションクラス
     * @class 放射線量データのコレクションクラス
     * @exports RadiationLogCollection
     * @constructor
     */
    var RadiationLogCollection = AbstractODataCollection.extend({
        model : RadiationLogModel,
        entity : "radiation",
        condition : {
            top : 1,
            orderby : "dateTime desc",
            filter : "station eq '浪江町役場'"
        },
        /**
         * 配列をマップに変換する。
         * 
         * @param {Object} レスポンス情報
         * @param {Object} オプション
         * @return {Objecy} レスポンス情報
         * @memberOf RadiationLogCollection#
         */
        parseOData: function (response, options) {
            return response;
        },

        // TODO: 開発用サーバにデータが入ったらこのメソッドは削除する
        /**
         * 開発用サーバにデータが無いのでダミーのsyncを利用する
         *
         * @return {undefined}
         */
        sync : function (method, model, opt) {
            var self = this;
            var URL_DUMMY_JSON = "http://www.json-generator.com/api/json/get/cpuAwBZPaW";

            if (method === "read") {
                model.trigger("request", model, null, opt);

                return $.get(URL_DUMMY_JSON).done(function (data) {
                    data.forEach(function (feature) {
                        feature.__id = _.uniqueId();
                        feature.dispTitle = "測定データ" + feature.__id;
                        feature.latitude = (35 + Math.random() * 5);
                        feature.longitude = (135 + Math.random() * 5);
                        feature.value = (0.001 + Math.random() * 0.5);
                    });

                    self.set(data);
                    self.trigger("sync", self, data, opt);
                });
            } else {
                return AbstractODataCollection.prototype.sync.apply(this, arguments);
            }
        },

        /**
         * GeoJSON形式に変換する。
         * @return {Object}
         * @memberOf RadiationLogCollection#
         */
        toGeoJSON : function() {
            var geoJSON;
            var features = [];

            this.each(function(model) {
                features.push(model.toGeoJSON());
            });

            geoJSON = {
                    "type": "FeatureCollection",
                    "features": features
            };

            return geoJSON;
        }
    });

    module.exports = RadiationLogCollection;
});

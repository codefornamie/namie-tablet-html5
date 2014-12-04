define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var ConfigurationModel = require("modules/model/misc/ConfigurationModel");

    /**
     * 設定情報のコレクションクラス
     * 
     * @class 設定情報のコレクションクラス
     * @exports ConfigurationCollection
     * @constructor
     */
    var ConfigurationCollection = AbstractODataCollection.extend({
        model : ConfigurationModel,
        entity : "configuration",
        condition : {
            top : 100,
        },
        /**
         * 配列をマップに変換する。
         * 
         * @param {Array} array 対象の配列
         * @param {String} keyField 配列要素のキーのプロパティ名
         * @param {String} valueField 配列要素の値のプロパティ名
         * @return {Objecy} 変換されたマップ
         */
        toMap : function() {
            var map = {};
            for (var i = 0; i < this.models.length; i++) {
                map[this.models[i].id] = this.models[i].get("value");
            }
            return map;
        }
    });

    module.exports = ConfigurationCollection;
});

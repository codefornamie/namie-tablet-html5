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
         * @return {Objecy} 変換されたマップ
         * @memberof ConfigurationCollection#
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

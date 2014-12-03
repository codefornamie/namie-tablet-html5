define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    /**
     * 設定情報のモデルクラスを作成する。
     * 
     * @class 設定情報のモデルクラス
     * @exports ConfigurationModel
     * @constructor
     */
    var ConfigurationModel = AbstractODataModel.extend({
        entity : "configuration",

    });

    module.exports = ConfigurationModel;
});

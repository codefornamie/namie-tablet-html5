define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var PersonalModel = require("modules/model/personal/PersonalModel");

    /**
     * パーソナル情報のコレクションクラス
     * 
     * @class パーソナル情報のコレクションクラス
     * @exports PersonalCollection
     * @constructor
     */
    var PersonalCollection = AbstractODataCollection.extend({
        model : PersonalModel,
        entity : "personal",
    });

    module.exports = PersonalCollection;
});

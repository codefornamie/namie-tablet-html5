define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RecommendModel = require("modules/model/article/RecommendModel");

    /**
     * おすすめ情報のコレクションクラス
     *
     * @class おすすめ情報のコレクションクラス
     * @exports RecommendCollection
     * @constructor
     */
    var RecommendCollection = AbstractODataCollection.extend({
        model : RecommendModel,
        entity : "recommend",
        condition : {
            top : 10,
        },
    });

    module.exports = RecommendCollection;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RecommendModel = require("modules/model/article/RecommendModel");

    /**
     * 記事情報のコレクションクラス
     */
    var RecommendCollection = AbstractODataCollection.extend({
        model : RecommendModel,
        entity : "recommend",
        condition : {
            top : 10000,
        },
    });

    module.exports = RecommendCollection;
});

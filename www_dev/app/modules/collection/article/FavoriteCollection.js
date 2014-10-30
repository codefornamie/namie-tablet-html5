define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var FavoriteModel = require("modules/model/article/FavoriteModel");

    /**
     * お気に入り情報のコレクションクラス
     */
    var FavoriteCollection = AbstractODataCollection.extend({
        model : FavoriteModel,
        entity : "favorite",
        condition : {
            top : 1000
        },
    });

    module.exports = FavoriteCollection;
});

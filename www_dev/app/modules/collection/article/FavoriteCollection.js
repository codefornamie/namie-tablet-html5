define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var FavoriteModel = require("modules/model/article/FavoriteModel");

    /**
     * お気に入り情報のコレクションクラス
     * @class お気に入り情報のコレクションクラス
     * @exports FavoriteCollection
     * @constructor
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

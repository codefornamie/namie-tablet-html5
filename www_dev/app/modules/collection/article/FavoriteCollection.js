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
        /**
         * 初期化処理
         * @memberOf FavoriteCollection#
         */
        initialize : function() {
            this.condition = {
                top : 1000
            };
        },
    });

    module.exports = FavoriteCollection;
});

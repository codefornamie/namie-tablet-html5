define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");

    /**
     * 道場のコンテンツのコレクションクラス
     * 
     * @class
     * @exports DojoContentCollection
     * @constructor
     */
    // TODO ArticleCollectionと同じ処理をしているので、道場コンテンツの読み込みに修正する
    var DojoContentCollection = ArticleCollection.extend({
        model : DojoContentModel,

        /**
         * 視聴済みコンテンツのモデルを返す
         * @return {Array}
         */
        getWatchedModels : function() {
            // TODO 実際の視聴済みコンテンツを返す
            return this.filter(function (model) {
                return true;
            }) || [];
        }
    });

    module.exports = DojoContentCollection;
});

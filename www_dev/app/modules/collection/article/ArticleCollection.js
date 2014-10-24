define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var ArticleModel = require("modules/model/article/ArticleModel");

    /**
     * 記事情報のコレクションクラス
     */
    var ArticleCollection = AbstractODataCollection.extend({
        model : ArticleModel,
        entity : "article",
        condition : {
            top : 10,
            orderby : "createdAt desc"
        },
    });

    module.exports = ArticleCollection;
});

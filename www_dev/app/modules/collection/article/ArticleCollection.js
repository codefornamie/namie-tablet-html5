define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var DateUtil = require("modules/util/DateUtil");

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
        parseOData: function (response, options) {
            _.each(response,function (res) {
                res.createdAt = DateUtil.formatDate(new Date(res.createdAt),"yyyy年MM月dd日 HH時mm分")
            })
            return response;
        },
    });

    module.exports = ArticleCollection;
});

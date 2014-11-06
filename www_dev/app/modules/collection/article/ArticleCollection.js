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
            top : 20,
            orderby : "createdAt desc"
        },
        parseOData: function (response, options) {
            _.each(response,function (res) {
                res.dispCreatedAt = DateUtil.formatDate(new Date(res.createdAt),"yyyy年MM月dd日 HH時mm分");
                res.tagsArray = [];
                res.tagsLabel = "";
                if (res.tags) {
                    var arr = res.tags.split(",");
                    _.each(arr,function (tag) {
                        res.tagsArray.push(decodeURIComponent(tag));
                    });
                }
            });
            return response;
        },
    });

    module.exports = ArticleCollection;
});

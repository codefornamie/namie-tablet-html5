define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var Code = require("modules/util/Code");
    var DateUtil = require("modules/util/DateUtil");
    var Equal = require("modules/util/filter/Equal");
    var Ge = require("modules/util/filter/Ge");
    var Le = require("modules/util/filter/Le");
    var And = require("modules/util/filter/And");
    var Or = require("modules/util/filter/Or");
    var IsNull = require("modules/util/filter/IsNull");

    /**
     * 記事情報のコレクションクラス。
     * 
     * @class 記事情報のコレクションクラス
     * @exports ArticleCollection
     * @constructor
     */
    var ArticleCollection = AbstractODataCollection.extend({
        model : ArticleModel,
        entity : "article",
        condition : {
            top : 100,
            orderby : "createdAt desc"
        },
        /**
         * レスポンス情報のパースを行う。
         * @param {Array} レスポンス情報の配列
         * @param {Object} オプション
         * @memberof ArticleCollection#
         */
        parseOData : function(response, options) {
            _.each(response, function(res) {
                res.dispCreatedAt = DateUtil.formatDate(new Date(res.createdAt), "yyyy年MM月dd日 HH時mm分");
                res.tagsArray = [];
                res.tagsLabel = "";
                if (res.tags) {
                    var arr = res.tags.split(",");
                    _.each(arr, function(tag) {
                        res.tagsArray.push(decodeURIComponent(tag));
                    });
                }
            });

            if (app.config.basic.mode === Code.APP_MODE_NEWS || app.config.basic.mode === Code.APP_MODE_OPE) {
                response = _.sortBy(response, function(res) {
                    return parseInt(res.sequence);
                });
            }

            return response;
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} condition 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberof ArticleCollection#
         */
        setSearchCondition : function(condition) {
            var targetDate = condition.targetDate;
            var dateString = DateUtil.formatDate(targetDate, "yyyy-MM-dd");

            this.condition.filters = [
                new And([
                        new Or([
                                new Equal("publishedAt", dateString), new And([
                                        new Le("publishedAt", dateString), new Ge("depublishedAt", dateString)
                                ])
                        ]), new IsNull("isDepublish")
                ])
            ];
        }
    });

    module.exports = ArticleCollection;
});

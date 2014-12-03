define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RecommendModel = require("modules/model/article/RecommendModel");
    var DateUtil = require("modules/util/DateUtil");
    var Equal = require("modules/util/filter/Equal");
    var Ge = require("modules/util/filter/Ge");
    var Le = require("modules/util/filter/Le");
    var And = require("modules/util/filter/And");
    var Or = require("modules/util/filter/Or");
    var IsNull = require("modules/util/filter/IsNull");

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

        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         */
        setSearchCondition : function(condition) {
            var targetDate = condition.targetDate;
            var dateString = DateUtil.formatDate(targetDate, "yyyy-MM-dd");

            this.condition.filters = [
                new Or([
                    new Equal("publishedAt", dateString), new And([
                        new Le("publishedAt", dateString), new Ge("depublishedAt", dateString)
                    ])
                ])
            ];
        }
    });

    module.exports = RecommendCollection;
});

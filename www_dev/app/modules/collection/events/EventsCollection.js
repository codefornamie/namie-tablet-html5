define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var EventsModel = require("modules/model/events/EventsModel");
    var DateUtil = require("modules/util/DateUtil");
    var Equal = require("modules/util/filter/Equal");
    var IsNull = require("modules/util/filter/IsNull");

    var EventsCollection = AbstractODataCollection.extend({
        model : EventsModel,
        entity : "event",
        condition : {
            top : 1000
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         */
        setSearchCondition : function(condition) {
            var targetDate = condition.targetDate;
            var dateString = DateUtil.formatDate(targetDate, "yyyy-MM-dd");

            this.condition.filters = [
                new Equal("publishedAt", dateString),
                new IsNull("isDepublish")
            ];
        }
    });

    module.exports = EventsCollection;
});

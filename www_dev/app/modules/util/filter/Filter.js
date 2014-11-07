define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Class = require("modules/util/Class");

    var Filter = Class.extend({
        init : function() {

        }
    });

    Filter.queryString = function(filters) {
        var queryValue = "";
        _.each(filters, function(filter) {
            var query = Filter.makeQueryString(filter);
            if (queryValue) {
                queryValue += " and ";
            }
            queryValue += query;
        });
        return queryValue;
    };
    Filter.searchCondition = function(condition) {
        if (!condition.top) {
            condition.top = 50;
        }
        if (condition.filters) {
            condition.filter = Filter.queryString(condition.filters);
        }
        return condition;
    };
    Filter.makeQueryString = function(filter) {
        if (filter.expression) {
            return filter.expression();
        } else if (_.isArray(filter)) {
            var query = "";
            _.each(filter, function(targetFilter) {
                if (query) {
                    query += " and ";
                }
                query += Filter.makeQueryString(targetFilter);
            });
            return "( " + query + " )";
        }
    };
    Filter.prototype.escapeSingleQuote = function(value) {
        var res = value.replace("'", "''");
        return res;
    };
    /**
     * この演算子が表現する式を生成する。
     * <p>
     * サブクラスは、このメソッドをオーバライドし、式を返却する処理を実装する必要がある。
     * </p>
     * 
     * @returns {String} 式
     */
    Filter.prototype.expression = function() {
        return "";
    };
    module.exports = Filter;
});

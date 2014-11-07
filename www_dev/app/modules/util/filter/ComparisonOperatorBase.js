define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Filter = require("modules/util/filter/Filter");

    var ComparisonOperatorBase = Filter.extend({
        init : function(key, value) {
            this.key = key;
            this.value = value;
        }
    });

    /**
     * この演算子が表現する式を生成する。
     * 
     * @returns {String} 式
     */
    ComparisonOperatorBase.prototype.expression = function() {
        return this.makeExpression(this);
    };
    ComparisonOperatorBase.prototype.makeExpression = function(equalOperator) {
        if (_.isString(equalOperator.value)) {
            return equalOperator.key + this.operator + "'" + this.escapeSingleQuote(equalOperator.value) + "'";
        } else if (_.isNumber(equalOperator.value)) {
            return equalOperator.key + this.operator + equalOperator.value;
        } else if (_.isBoolean(equalOperator.value)) {
            return this.key + this.operator + equalOperator.value;
        } else {
            return this.customeMakeExpression(equalOperator);
        }
    };
    ComparisonOperatorBase.prototype.customeMakeExpression = function(equalOperator) {
        
    };
    module.exports = ComparisonOperatorBase;
});

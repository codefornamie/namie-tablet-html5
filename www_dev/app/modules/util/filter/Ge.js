define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ComparisonOperatorBase = require("modules/util/filter/ComparisonOperatorBase");

    var Ge = ComparisonOperatorBase.extend({
        init : function(key, value, isThan) {
            this.key = key;
            this.value = value;
            if (!isThan) {
                isThan = false;
            }
            if (isThan) {
                this.operator = " gt ";
            } else {
                this.operator = " ge ";
            }
        }
    });

//    /**
//     * この演算子が表現する式を生成する。
//     * 
//     * @returns {String} 式
//     */
//    Ge.prototype.expression = function() {
//        return this.makeExpression(this);
//    };
//    Ge.prototype.makeExpression = function(equalOperator) {
//        if (_.isString(equalOperator.value)) {
//            return equalOperator.key + this.operator + this.escapeSingleQuote(equalOperator.value) + "'";
//        } else if (_.isNumber(equalOperator.value)) {
//            return equalOperator.key + this.operator + equalOperator.value;
//        } else if (_.isBoolean(equalOperator.value)) {
//            return this.key + this.operator + equalOperator.value;
//        } else {
//            throw new Error("unsupoported value type error.");
//        }
//    };
    module.exports = Ge;
});

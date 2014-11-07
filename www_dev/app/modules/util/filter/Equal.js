define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ComparisonOperatorBase = require("modules/util/filter/ComparisonOperatorBase");
    
    var Equal = ComparisonOperatorBase.extend({
        init : function(key, value) {
            this.key = key;
            this.value = value;
            this.operator = " eq ";
        }
    });

//    /**
//     * この演算子が表現する式を生成する。
//     * 
//     * @returns {String} 式
//     */
//    Equal.prototype.expression = function() {
//        return this.makeExpression(this);
//    };

    Equal.prototype.customeMakeExpression = function(equalOperator) {
        if (_.isArray(equalOperator.value)) {
            // 配列が指定された場合、or で結合する
            // 例： ( property eq 100 or property eq 101 or property eq 102 )
            var query = "";
            var self = this;
            _.each(this.value, function(targetValue) {
                var equal = new Equal(self.key, targetValue);
                if (query) {
                    query += " or ";
                }
                query += self.makeExpression(equal);
            });
            return "( " + query + " )";
        } else {
            throw new Error("unsupoported value type.");
        }
    };
    module.exports = Equal;
});

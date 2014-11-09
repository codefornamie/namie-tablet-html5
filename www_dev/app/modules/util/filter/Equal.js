define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ComparisonOperatorBase = require("modules/util/filter/base/ComparisonOperatorBase");

    /**
     * $filterのeq演算子を利用する式を生成する機能を提供するクラスを作成する。
     * 
     * @class $filterのeq演算子を利用する式を生成する機能を提供するクラス
     * @exports Equal
     * @constructor
     */
    var Equal = ComparisonOperatorBase.extend({
        init : function(key, value) {
            this.key = key;
            this.value = value;
            this.operator = " eq ";
        }
    });

    /**
     * eq演算子固有の式の作成処理を行う。
     * @param {Array} equalOperator Equalクラスのインスタンスの配列
     * @returns {String} 生成した式
     */
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

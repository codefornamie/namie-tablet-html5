define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Filter = require("modules/util/filter/Filter");
    /**
     * 比較演算子の式を生成するための共通機能を提供するクラスを作成する。
     * 
     * @class 比較演算子の式を生成するための共通機能を提供するクラス
     * @exports ComparisonOperatorBase
     * @constructor
     */
    var ComparisonOperatorBase = Filter.extend({
        init : function(key, value) {
            this.key = key;
            this.value = value;
        }
    });

    /**
     * この演算子が表現する式を生成する。
     * 
     * @returns {String} 生成した式
     */
    ComparisonOperatorBase.prototype.expression = function() {
        return this.makeExpression(this);
    };

    /**
     * 指定された演算子が表現する式を生成する。
     * 
     * @param {Filter}
     *            operator 演算子クラスのインスタンス。または、演算子クラスのインスタンスの配列。
     * @return {String} 式
     */
    ComparisonOperatorBase.prototype.makeExpression = function(operator) {
        if (_.isNull(operator.value)) {
            return operator.key + this.operator + "null";
        } else if (_.isString(operator.value)) {
            return operator.key + this.operator + "'" + this.escapeSingleQuote(operator.value) + "'";
        } else if (_.isNumber(operator.value)) {
            return operator.key + this.operator + operator.value;
        } else if (_.isBoolean(operator.value)) {
            return this.key + this.operator + operator.value;
        } else {
            return this.customeMakeExpression(operator);
        }
    };
    /**
     * サブクラスの演算子固有の式の作成処理を行う。
     * <p>
     * サブクラスは、このメソッドをオーバライドし、サブクラスの演算子固有の式の作成処理を実装できる。
     * </p>
     * 
     * @param {Array}
     *            operator 演算子クラスのインスタンス。または、演算子クラスのインスタンスの配列。
     * @returns {String} 生成した式
     */
    ComparisonOperatorBase.prototype.customeMakeExpression = function(operator) {

    };
    module.exports = ComparisonOperatorBase;
});

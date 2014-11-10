define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Filter = require("modules/util/filter/Filter");
    /**
     * 論理演算子の式を生成するための共通機能を提供するクラスを作成する。
     * 
     * @class 論理演算子の式を生成するための共通機能を提供するクラス
     * @exports LogicalOperatorBase
     * @constructor
     */
    var LogicalOperatorBase = Filter.extend({
        init : function(operators) {
            this.operators = operators;
        }
    });
    /**
     * 論理演算子を表す文字列を返却する。
     * <p>
     * サブクラスは、本メソッドをオーバライドして、論理演算子を表す文字列を返却する処理を実装する。
     * </p>
     * 
     * @return {String} 論理演算子
     */
    LogicalOperatorBase.prototype.operator = function() {

    };
    /**
     * この演算子が表現する式を生成する。
     * 
     * @return {String} 生成した式
     */
    LogicalOperatorBase.prototype.expression = function() {
        var expression = "";
        var self = this;
        _.each(this.operators, function(operator) {
            if (expression) {
                expression += self.operator();
            }
            if (_.isArray(operator)) {
                expression += "( " + Filter.queryString(operator) + " )";
            } else {
                expression += "( " + operator.expression() + " )";
            }
            
        });
        return expression;
    };

    module.exports = LogicalOperatorBase;
});

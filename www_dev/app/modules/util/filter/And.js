define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var LogicalOperatorBase = require("modules/util/filter/LogicalOperatorBase");
    /**
     * $filterのand演算子の式を生成するためのクラスを作成する。
     * 
     * @class $filterのand演算子の式を生成するためのクラス
     * @exports And
     * @constructor
     */
    var And = LogicalOperatorBase.extend({
        init : function(operators) {
            this._super(operators);
        }
    });
    /**
     * and演算子を文字列として返却する。
     * 
     * @returns {String} and演算子
     */
    And.prototype.operator = function() {
        return " and ";
    };

    module.exports = And;
});

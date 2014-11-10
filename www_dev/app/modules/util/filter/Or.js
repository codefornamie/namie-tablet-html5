define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var LogicalOperatorBase = require("modules/util/filter/base/LogicalOperatorBase");
    /**
     * $filterのor演算子の式を生成するためのクラスを作成する。
     * 
     * @class $filterのor演算子の式を生成するためのクラス
     * @exports Or
     * @constructor
     */
    var Or = LogicalOperatorBase.extend({
        init : function(operators) {
            this._super(operators);
        }
    });
    /**
     * or演算子を文字列として返却する。
     * 
     * @returns {String} and演算子
     */
    Or.prototype.operator = function() {
        return " or ";
    };

    module.exports = Or;
});

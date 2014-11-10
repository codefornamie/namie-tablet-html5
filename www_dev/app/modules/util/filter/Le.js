define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ComparisonOperatorBase = require("modules/util/filter/base/ComparisonOperatorBase");
    /**
     * $filterのle,lt演算子を利用する式を生成する機能を提供するクラスを作成する。
     * 
     * @class $filterのle,lt演算子を利用する式を生成する機能を提供するクラス
     * @exports Le
     * @constructor
     */
    var Le = ComparisonOperatorBase.extend({
        init : function(key, value, isThan) {
            this.key = key;
            this.value = value;
            if (!isThan) {
                isThan = false;
            }
            if (isThan) {
                this.operator = " lt ";
            } else {
                this.operator = " le ";
            }
        }
    });

    module.exports = Le;
});
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ComparisonOperatorBase = require("modules/util/filter/base/ComparisonOperatorBase");
    /**
     * $filterのge,gt演算子を利用する式を生成する機能を提供するクラスを作成する。
     * 
     * @class $filterのge,gt演算子を利用する式を生成する機能を提供するクラス
     * @exports Ge
     * @constructor
     */
    var Ge = ComparisonOperatorBase.extend({
        /**
         * 初期化処理を行う
         * @param {Object} key $filterクエリのキー
         * @param {Object} value $filterクエリの値
         * @param {Boolean} isThan gtクエリまたはgeクエリを指定するかの真偽値
         * @memberOf Ge#
         */
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

    module.exports = Ge;
});

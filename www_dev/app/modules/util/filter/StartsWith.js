define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Filter = require("modules/util/filter/Filter");

    /**
     * $filterのstartswith演算子を利用する式を生成するクラスを作成する。
     * 
     * @class $filterのstartswith演算子を利用する式を生成するクラス
     * @exports StartsWith
     * @constructor
     */
    var StartsWith = Filter.extend({
        /**
         * 初期化処理を行う
         * @param {Object} key startswith演算子のキー
         * @param {Object} value startswith演算子の値
         * @memberof StartsWith#
         */
        init : function(key, value) {
            this.key = key;
            this.value = value;
        }
    });
    /**
     * この演算子が表現する式を生成する。
     * 
     * @returns {String} 生成した式
     * @memberof StartsWith#
     */
    StartsWith.prototype.expression = function() {
        return "startswith(" + this.key + ", '" + this.escapeSingleQuote(this.value) + "')";
    };

    module.exports = StartsWith;
});

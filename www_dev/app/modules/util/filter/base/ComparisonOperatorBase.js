/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
     * @memberOf ComparisonOperatorBase#
     * @return {String} 生成した式
     */
    ComparisonOperatorBase.prototype.expression = function() {
        return this.makeExpression(this);
    };

    /**
     * 指定された演算子が表現する式を生成する。
     * 
     * @memberOf ComparisonOperatorBase#
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
     * @memberOf ComparisonOperatorBase#
     * @param {Array}
     *            operator 演算子クラスのインスタンス。または、演算子クラスのインスタンスの配列。
     * @return {String} 生成した式
     */
    ComparisonOperatorBase.prototype.customeMakeExpression = function(operator) {

    };
    module.exports = ComparisonOperatorBase;
});

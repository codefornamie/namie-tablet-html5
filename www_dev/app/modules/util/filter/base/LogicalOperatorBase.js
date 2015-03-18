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
     * @memberOf LogicalOperatorBase#
     * @return {String} 論理演算子
     */
    LogicalOperatorBase.prototype.operator = function() {

    };
    /**
     * この演算子が表現する式を生成する。
     * 
     * @memberOf LogicalOperatorBase#
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

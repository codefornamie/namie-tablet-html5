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
    var ComparisonOperatorBase = require("modules/util/filter/base/ComparisonOperatorBase");

    /**
     * $filterのeq演算子を利用する式を生成する機能を提供するクラスを作成する。
     * 
     * @class $filterのeq演算子を利用する式を生成する機能を提供するクラス
     * @exports Equal
     * @constructor
     */
    var Equal = ComparisonOperatorBase.extend({
        /**
         * 初期化処理を行う
         * @param {Object} key eq演算子のキー
         * @param {Object} value eq演算子の値
         * @memberOf Equal#
         */
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
     * @memberOf Equal#
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

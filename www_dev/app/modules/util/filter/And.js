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
    var LogicalOperatorBase = require("modules/util/filter/base/LogicalOperatorBase");
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
     * @memberOf And#
     */
    And.prototype.operator = function() {
        return " and ";
    };

    module.exports = And;
});

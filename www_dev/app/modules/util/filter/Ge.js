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

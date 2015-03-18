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
         * @memberOf StartsWith#
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
     * @memberOf StartsWith#
     */
    StartsWith.prototype.expression = function() {
        return "startswith(" + this.key + ", '" + this.escapeSingleQuote(this.value) + "')";
    };

    module.exports = StartsWith;
});

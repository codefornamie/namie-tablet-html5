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

    /**
     * 文字列ユーティリティ
     * @class 文字列ユーティリティ
     * @constructor
     */
    var StringUtil = function() {

    };
    /**
     * 先頭文字が対象の値であるかの判定をする。
     * @memberOf StringUtil#
     * @param {String} str 検索対象
     * @param {Object} prefix 検索する値
     * @return 先頭文字が対象の値であるかの真偽値 ture:対象文字, false:対象文字でない
     */
    StringUtil.startsWith = function(str, prefix) {
        return str.lastIndexOf(prefix, 0) === 0;
    };

    /**
     * URLのクエリ文字列をパースする。
     * @memberOf StringUtil#
     * @param {String} queryString クエリ文字列
     * @return {Object} queryStringをパースした結果のマップオブジェクト。
     */
    StringUtil.parseQueryString = function(queryString) {
        var params = {};
        if (queryString) {
            _.each(_.map(decodeURI(queryString).split(/&/g), function(el) {
                var aux = el.split("="), o = {};
                if (aux.length >= 1) {
                    var val;
                    if (aux.length === 2) {
                        val = aux[1];
                    }
                    o[aux[0]] = val;
                }
                return o;
            }), function(o) {
                _.extend(params, o);
            });
        }
        return params;
    };

    module.exports = StringUtil;
});

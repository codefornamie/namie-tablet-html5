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
    var Ge = require("modules/util/filter/Ge");
    var Le = require("modules/util/filter/Le");
    var And = require("modules/util/filter/And");
    var DateUtil = require("modules/util/DateUtil");

    /**
     * 日付の範囲検索をするための式を生成するクラスを作成する。
     * 
     * @class 日付の範囲検索をするための式を生成するクラス
     * @exports BetweenDayPeriod
     * @constructor
     */
    var BetweenDayPeriod = Filter.extend({
        /**
         * 初期化処理を行う
         * @param {String} key 
         * @param {String} from 
         * @param {String} to 
         * @param {String} dayFormat 
         * @memberOf BetweenDayPeriod#
         */
        init : function(key, from, to, dayFormat) {
            if (!dayFormat) {
                dayFormat = "yyyy-MM-dd";
            }
            this.key = key;
            this.from = DateUtil.formatDate(from, dayFormat);
            this.fromDate = from;
            this.to = DateUtil.formatDate(to, dayFormat);
            this.toDate = to;
        }
    });
    /**
     * 日付の範囲検索を行う式を生成する。
     * 
     * @returns {String} 生成した式
     * @memberOf BetweenDayPeriod#
     */
    BetweenDayPeriod.prototype.expression = function() {
        var ge = new Ge(this.key, this.from);
        var lt = new Le(this.key, this.to, true);
        return Filter.queryString([new And([ge, lt])]);
    };

    module.exports = BetweenDayPeriod;
});

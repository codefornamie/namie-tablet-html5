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
     * ロガー
     * @class ロガー
     * @constructor
     */
    var Logger = function() {
    };
    
    /**
     * INFOログ出力
     * @memberOf Logger#
     * @param {String} メッセージ
     */
    Logger.info = function(msg) {
        console.log(Logger.getDateString() + " " + msg);
    };
    /**
     * DEBUGログ出力
     * @memberOf Logger#
     * @param {String} メッセージ
     */
    Logger.debug = function(msg) {
        console.log(Logger.getDateString() + " " + msg);
    };
    /**
     * 現在の日付文字列の生成
     * @memberOf Logger#
     * @return 現在の日付文字列
     */
    Logger.getDateString = function() {
        var now = new Date();
        var y = now.getFullYear();
        var mm = now.getMonth() + 1;
        var d = now.getDate();
        var h = now.getHours();
        var m = now.getMinutes();
        var s = now.getSeconds();
        var ms = now.getMilliseconds();


        if (mm < 10) {
            mm = '0' + mm;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        if (ms < 10) {
            ms = '00' + ms;
        } else if (ms < 100) {
            ms = '0' + ms;
        }
        return y + '.' + mm + '.' + d + ' ' + h + ":" + m + ":" + s + ":" + ms;
    };
    module.exports = Logger;
});

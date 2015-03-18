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
define(function (require, exports, module) {
    "use strict";

    /**
     * PIOImageを扱うクラス
     * @class
     * @exports PIOImage
     * @constructor
     */
    var P = function PIOImage() {};

    /**
     * キャッシュ用テーブル
     */
    P._binaryTable = {};
    
    /**
     * sucessFn関数に渡された仮引数をkeyをキーにキャッシュする
     * @param {String} key
     * @param {Function} successFn
     * @return {Function}
     */
    P._memoize = function (key, successFn) {
        return function (res) {
            P._binaryTable[key] = res;

            successFn.call(this, res);
        };
    };

    /**
     * バイナリをキャッシュから取得する。キャッシュになければサーバーから取得する
     * @param {dcc.DcCollection} col
     * @param {String} imageUrl
     * @param {Object} opt
     */
    P.getBinaryWithCache = function (col, imageUrl, opt) {
        opt = opt || {};

        var storedBinary = P._binaryTable[imageUrl];

        if (!storedBinary) {
            opt.success = P._memoize(imageUrl, opt.success);

            return col.getBinary(imageUrl, opt);
        }

        if (opt.success) {
            setTimeout(function () {
                opt.success(storedBinary);
            }, 0);
        }
    };

    module.exports = P;
});
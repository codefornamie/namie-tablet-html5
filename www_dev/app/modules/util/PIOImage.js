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
define(function (require, exports, module) {
    "use strict";

    var FileAPIUtil = require("modules/util/FileAPIUtil");

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
    P._cacheTable = {};
    
    /**
     * sucessFn関数に渡された仮引数をkeyをキーにキャッシュする
     * @param {String} key
     * @param {Function} successFn
     * @return {Function}
     */
    P._memoize = function (key, successFn) {
        return function (res) {
            var cached = P._cacheTable[key] = res;

            successFn.call(this, cached);
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

        var storedBinary = P._cacheTable[imageUrl];

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

    /**
     * バイナリをBlobURLに変換する
     * @param {ArrayBuffer} binary
     * @return {String}
     */
    P._convertBinaryToUrl = function (binary) {
        var arrayBufferView = new Uint8Array(binary);
        var blob = new Blob([
            arrayBufferView
        ], {
            type : "image/jpg"
        });
        var url = FileAPIUtil.createObjectURL(blob);

        return url;
    };

    /**
     * BlobURLをキャッシュから取得する。キャッシュになければサーバーから取得する
     * @param {dcc.DcCollection} col
     * @param {String} imageUrl
     * @param {Object} opt
     */
    P.getUrlWithCache = function (col, imageUrl, opt) {
        opt = opt || {};

        var storedBinary = P._cacheTable[imageUrl];

        if (!storedBinary) {
            // サーバーから取得したバイナリをBlobURLに変換してからメモ化している
            var memoized = P._memoize(imageUrl, opt.success);
            opt.success = _.compose(memoized, P._convertBinaryToUrl);

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
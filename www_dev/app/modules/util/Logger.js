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

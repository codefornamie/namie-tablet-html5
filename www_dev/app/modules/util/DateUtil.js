define(function(require, exports, module) {
    "use strict";

    var DateUtil = function() {

    };
    /**
     * Dateオブジェクトを、指定された文字列フォーマットに変換する。
     * @param {Date} date 日付情報
     * @param {String} format 日付フォーマット
     */
    DateUtil.formatDate = function(date, format) {

        var result = format;

        var f;
        var rep;

        var yobi = new Array('日', '月', '火', '水', '木', '金', '土');

        f = 'yyyy';
        if (result.indexOf(f) > -1) {
            rep = date.getFullYear();
            result = result.replace(/yyyy/, rep);
        }

        f = 'MM';
        if (result.indexOf(f) > -1) {
            rep = DateUtil.zeroPadding(date.getMonth() + 1, 2);
            result = result.replace(/MM/, rep);
        }

        f = 'ddd';
        if (result.indexOf(f) > -1) {
            rep = yobi[date.getDay()];
            result = result.replace(/ddd/, rep);
        }

        f = 'dd';
        if (result.indexOf(f) > -1) {
            rep = DateUtil.zeroPadding(date.getDate(), 2);
            result = result.replace(/dd/, rep);
        }

        f = 'HH';
        if (result.indexOf(f) > -1) {
            rep = DateUtil.zeroPadding(date.getHours(), 2);
            result = result.replace(/HH/, rep);
        }

        f = 'mm';
        if (result.indexOf(f) > -1) {
            rep = DateUtil.zeroPadding(date.getMinutes(), 2);
            result = result.replace(/mm/, rep);
        }

        f = 'ss';
        if (result.indexOf(f) > -1) {
            rep = DateUtil.zeroPadding(date.getSeconds(), 2);
            result = result.replace(/ss/, rep);
        }

        f = 'fff';
        if (result.indexOf(f) > -1) {
            rep = DateUtil.zeroPadding(date.getMilliseconds(), 3);
            result = result.replace(/fff/, rep);
        }

        return result;

    };
    DateUtil.zeroPadding = function(value, length) {
        return new Array(length - ('' + value).length + 1).join('0') + value;
    };

    module.exports = DateUtil;
});

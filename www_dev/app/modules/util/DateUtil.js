define(function(require, exports, module) {
    "use strict";

    /**
     * 日付ユーティリティ
     * @class 日付ユーティリティ
     * @constructor
     */
    var DateUtil = function() {

    };
    /**
     * Dateオブジェクトを、指定された文字列フォーマットに変換する。
     * @param {Date} date 日付情報
     * @param {String} format 日付フォーマット
     * @memberOf DateUtil#
     */
    DateUtil.formatDate = function(date, format) {

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return "";
        }
            
        var result = format;

        var f;
        var rep;

        var yobi = new Array('日', '月', '火', '水', '木', '金', '土');

        f = 'ggge';
        if (result.indexOf(f) > -1) {
            var japaneseDate = new Intl.DateTimeFormat("ja-JP-u-ca-japanese").format(date);
            rep = japaneseDate.substring(0, japaneseDate.indexOf(("/")));
            result = result.replace(/ggge/, rep);
        }

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
    /**
     * ゼロ埋めを行う
     * @memberOf DateUtil#
     * @param {Number} value ゼロ埋め後に加える値
     * @param {Number} length length
     */
    DateUtil.zeroPadding = function(value, length) {
        return new Array(length - ('' + value).length + 1).join('0') + value;
    };
    /**
     * Dateオブジェクトを生成する
     * @memberOf DateUtil#
     * @param {Number} date 時間
     * @param {Number} days 日付
     * @return Dateオブジェクト
     */
    DateUtil.addDay = function(date, days) {
        var dayTime = 1000 * 60 * 60 * 24 * days;
        return new Date(date.getTime() + dayTime);
    };
    module.exports = DateUtil;
});

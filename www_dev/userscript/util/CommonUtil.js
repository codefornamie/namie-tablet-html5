/* global StatusCode: false */
/* global StringUtil: false */
/**
 * ユーザスクリプト共通のユーティリティクラスを作成する。
 * 
 * @class ユーザスクリプト共通のユーティリティクラス
 * @constructor
 */
function CommonUtil() {

}
/**
 * extend function
 * 
 * @param {Object} s superclass
 * @param {Function} c constructor
 */
CommonUtil.extend = function(s, c) {
    function F() {
    }
    F.prototype = s.prototype;
    c.prototype = new F();
    c.prototype.superclass = s.prototype;
    c.prototype.superclass.constructor = s;
    c.prototype.constructor = c;
    c.prototype.superclazz = function(clazz) {
        if (clazz && clazz === this.superclass.constructor) {
            return this.superclass.superclazz(clazz);
        } else {
            return this.superclass;
        }
    };
    return c;
};
CommonUtil.base64decord = function(str) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1,
            63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31,
            32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
    // var base64list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    // var t = '', p = -8, a = 0, c, d;
    //
    // for (var i = 0; i < s.length; i++) {
    // if ((c = base64list.indexOf(s.charAt(i))) < 0)
    // continue;
    // a = (a << 6) | (c & 63);
    // if ((p += 6) >= 0) {
    // d = (a >> p) & 255;
    // if (c != 64)
    // t += String.fromCharCode(d);
    // a &= 63;
    // p -= 8;
    // }
    // }
    // return t;
};
/**
 * URL文字列からセルIDを取得する。
 * @param cellUrl URL
 * @returns セルID
 */
CommonUtil.getCellNameByUrl = function(cellUrl) {
    var cellUrlLength = StringUtil.stringLength(cellUrl);
    var index = cellUrl.lastIndexOf('/', cellUrlLength - 2);
    var cellId = cellUrl;
    if (index >= 0) {
        cellId = cellUrl.substring(index + 1, cellUrlLength - 1);
    }
    return cellId;
};
/**
 * HTTPメソッドを取得する。
 * <p>
 * リクエストヘッダに、x-http-method-override が含まれている場合、 そこに定義されている値を返却する。<br/> そうでない場合、JSGIRequest.methodの値を返却する。
 * </p>
 * 
 * @param {JSGIRequest} req クライアントからのリクエスト情報
 */
CommonUtil.getHttpMethod = function(req) {
    if (req.headers && req.headers["x-http-method-override"]) {
        return req.headers["x-http-method-override"];
    } else {
        return req.method;
    }
};

/**
 * クラス名を返す
 * 
 * @param {Object} obj クラスインスタンス
 * 
 * @return {String} クラス名
 */
CommonUtil.getClassName = function(obj) {
    if (typeof (obj) === "object") {
        if (("" + obj.constructor).match(/^\s*function +(\w+)/)) {
            return RegExp.$1;
        }
    }
    return typeof (obj);
};
CommonUtil.isEngineException = function(e) {
    return e.hasOwnProperty("code");
};
exports.CommonUtil = CommonUtil;
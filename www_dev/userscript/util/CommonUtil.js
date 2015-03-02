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
exports.CommonUtil  = CommonUtil;
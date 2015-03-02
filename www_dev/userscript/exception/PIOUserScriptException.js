/* global dc: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/* global StringUtil: false */
/* global Message: false */
/* global JSGIResponse: false */
/**
 * personium.ioのユーザースクリプトの処理でエラーが発生した場合にスローされる例外を作成する。
 * 
 * @class personium.ioのユーザースクリプトの処理でエラーが発生した場合にスローされる例外
 * @constructor
 * @param {String} message メッセージ
 * @param {Array} params エラーメッセージパラメタ
 * @param {String} detail エラー詳細
 * @param {Error} cause エラー原因
 */
function PIOUserScriptException(message, params, cause) {
    this.message = Message.getMessage(message, params);
    this.cause = cause;

    this.statusCode = StatusCode.HTTP_INTERNAL_SERVER_ERROR;
    if (cause) {
        if (cause.code) {
            this.statusCode = cause.code;
        }
        this.causeMessage = cause.message;
    }
}
PIOUserScriptException.prototype = new Error();

/**
 * この例外の文字列情報を取得する。
 * 
 * @return エラー情報を表現する文字列
 */
PIOUserScriptException.prototype.toString = function() {
    var causeString = null;
    if (this.cause) {
        causeString = this.cause.toString();
    }
    return CommonUtil.getClassName(this) + " [statusCode:" + this.statusCode + ", message:" + this.message +
            " (cause=" + causeString + ")]";
};

/**
 * この例外をクライアントにレスポンスできるデータにシリアライズする。
 * 
 * @returns {JSGIResponse} この例外の情報が含まれるレスポンスデータ
 */
PIOUserScriptException.prototype.serialize = function() {

    var response = new JSGIResponse();
    var status = StatusCode.HTTP_OK;

    if (this.statusCode !== null) {
        status = this.statusCode;
    }
    // クライアントに返却するステータスコード
    response.status = String(status);

    response.setResponseData({
        "message" : this.message,
        "cause" : this.cause
    });

    return response;
};

exports.PIOUserScriptException = PIOUserScriptException;

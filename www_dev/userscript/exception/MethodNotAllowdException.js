/* global PIOUserScriptException: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/**
 * 許可されていないリクエストメソッドでユーザスクリプトが呼び出された場合の例外を作成する。
 * 
 * @param {String} method クライアントから指定されたメソッド
 * @param {Array} allowdMethods ユーザスクリプトで許可されているメソッド
 */
function MethodNotAllowdException(method, allowdMethods) {
    this.superclass.constructor.apply(this, [
            "The request %1 Method not allowed. Allowed methods=%2.", [
                    method, allowdMethods
            ]
    ]);
    this.method = method;
    this.allowdMethods = allowdMethods;
    this.statusCode = StatusCode.HTTP_METHOD_NOT_ALLOWD;
}
exports.MethodNotAllowdException = CommonUtil.extend(PIOUserScriptException, MethodNotAllowdException);
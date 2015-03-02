/* global StatusCode: false */
/* global CommonUtil: false */
/* global PIOUserScriptException: false */
/**
 * ユーザスクリプトの実行中、予期しないエラーが発生した場合の例外を作成する。
 * 
 * @param {String} scriptName ユーザースクリプト名
 * @param {Error} error 発生したエラー
 */
function PIOUnknownException(scriptName, error) {
    this.superclass.constructor.apply(this, [
            "Unknown error occured. userscript=%1 error=%2.", [
                    scriptName, error
            ]
    ]);
    this.statusCode = StatusCode.HTTP_INTERNAL_SERVER_ERROR;
}
exports.PIOUnknownException = CommonUtil.extend(PIOUserScriptException, PIOUnknownException);
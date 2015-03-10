/* global PIOUserScriptException: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/**
 * 更新権限を持っていないレコードを更新しようとした場合の例外を作成する。
 * 
 * @param {String} entity 更新対象のentity名
 * @param {String} id 更新対象のID
 */
function NoRefreshTokenException() {
    this.superclass.constructor.apply(this, [
            "requires refresh token.", []
    ]);
    this.statusCode = StatusCode.HTTP_BAD_REQUEST;
}
exports.NoRefreshTokenException = CommonUtil.extend(PIOUserScriptException, NoRefreshTokenException);

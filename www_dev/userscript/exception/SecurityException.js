/* global PIOUserScriptException: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/**
 * 更新権限を持っていないレコードを更新しようとした場合の例外を作成する。
 * 
 * @param {String} entity 更新対象のentity名
 * @param {String} id 更新対象のID
 */
function SecurityException(entity, id) {
    this.superclass.constructor.apply(this, [
            "The request is unauthenticated. entity=%1, id=%2.", [
                    entity, id
            ]
    ]);
    this.entity = entity;
    this.id = id;
    this.statusCode = StatusCode.HTTP_FORBIDDEN;
}
exports.SecurityException = CommonUtil.extend(PIOUserScriptException, SecurityException);
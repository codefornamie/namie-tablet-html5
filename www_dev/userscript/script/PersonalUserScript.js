/* global AbstractRegisterUserScript: false */
/* global CommonUtil: false */

/**
 * パーソナル情報のユーザスクリプトを作成する。
 * @class パーソナル情報のユーザスクリプト
 * @param {Object} request リクエスト情報を保持するオブジェクト
 */
function PersonalUserScript(request) {
    this.superclass.superclass.constructor.apply(this, [
            request, [
                    "POST", "PUT", "DELETE"
            ]
    ]);
    this.entity = "personal";
}
var PersonalUserScript = CommonUtil.extend(AbstractRegisterUserScript, PersonalUserScript);

exports.PersonalUserScript = PersonalUserScript;
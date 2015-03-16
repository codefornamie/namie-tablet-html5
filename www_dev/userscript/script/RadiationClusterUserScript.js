/* global AbstractRegisterUserScript: false */
/* global CommonUtil: false */

/**
 * 放射線のクラスター情報のユーザスクリプトを作成する。
 * @class 放射線のクラスター情報のユーザスクリプト
 * @param {Object} request リクエスト情報を保持するオブジェクト
 */
function RadiationClusterUserScript(request) {
    this.superclass.superclass.constructor.apply(this, [
            request, [
                    "POST", "PUT"
            ]
    ]);
    this.entity = "radiation_cluster";
}
var RadiationClusterUserScript = CommonUtil.extend(AbstractRegisterUserScript, RadiationClusterUserScript);

exports.RadiationClusterUserScript = RadiationClusterUserScript;
/* global AbstractRegisterUserScript: false */
/* global CommonUtil: false */

/**
 * 記事情報のユーザスクリプトを作成する。
 * @class 記事情報のユーザスクリプト
 * @param {Object} request リクエスト情報を保持するオブジェクト
 */
function AchievementUserScript(request) {
    this.superclass.superclass.constructor.apply(this, [
            request, [
                    "POST", "PUT"
            ]
    ]);
    this.entity = "achievement";
}
var AchievementUserScript = CommonUtil.extend(AbstractRegisterUserScript, AchievementUserScript);

exports.AchievementUserScript = AchievementUserScript;
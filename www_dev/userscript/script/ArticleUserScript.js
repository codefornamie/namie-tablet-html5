/* global AbstractRegisterUserScript: false */
/* global CommonUtil: false */

/**
 * 記事情報のユーザスクリプトを作成する。
 * @class 記事情報のユーザスクリプト
 * @param {Object} request リクエスト情報を保持するオブジェクト
 */
function ArticleUserScript(request) {
    this.superclass.superclass.constructor.apply(this, [
            request, [
                    "POST", "PUT", "DELETE"
            ]
    ]);
    this.entity = "article";
}
var ArticleUserScript = CommonUtil.extend(AbstractRegisterUserScript, ArticleUserScript);

exports.ArticleUserScript = ArticleUserScript;
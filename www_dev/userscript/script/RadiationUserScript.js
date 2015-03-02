/* global PIOUserScript: false */
/* global dc: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/* global StringUtil: false */
function RadiationUserScript(request) {
    this.superclass.constructor.apply(this, [
            request, [
                "POST"
            ]
    ]);
}
var RadiationUserScript = CommonUtil.extend(PIOUserScript, RadiationUserScript);

/**
 * 放射線情報を登録する
 * @param {Object} input 入力データ
 * @returns {JSGIResponse} 処理結果
 */
RadiationUserScript.prototype.create = function(input) {

};

exports.RadiationUserScript = RadiationUserScript;
/* global PIOUserScript: false */
/* global dc: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/* global StringUtil: false */
/* global JSGIResponse: false */
/* global Message: false */

/**
 * 放射線のクラスター情報のユーザスクリプトを作成する。
 * @class 放射線のクラスター情報のユーザスクリプト
 * @param {Object} request リクエスト情報を保持するオブジェクト
 */
function RadiationClusterUserScript(request) {
    this.superclass.constructor.apply(this, [
            request, [
                "POST"
            ]
    ]);
    this.entity = "radiation_cluster";
}
var RadiationClusterUserScript = CommonUtil.extend(PIOUserScript, RadiationClusterUserScript);

/**
 * 放射線クラスター情報を登録する
 * @param {Object} input 入力データを保持するJSONオブジェクト
 * @returns {JSGIResponse} 処理結果
 */
RadiationClusterUserScript.prototype.create = function(input) {
    var dataJson = input;
    this.log('I', 'Start radiaton cluster. data=%1', [
        JSON.stringify(dataJson)
    ]);
    var res = this.cell.box(this.box).odata(this.odata).entitySet(this.entity).create(dataJson);

    var response = new JSGIResponse();
    response.status = StatusCode.HTTP_OK;
    response.setResponseData({
        "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
            CommonUtil.getClassName(this)
        ]),
        "d" : {
            "results" : JSON.stringify(res)
        }
    });
    return response;
};

exports.RadiationClusterUserScript = RadiationClusterUserScript;
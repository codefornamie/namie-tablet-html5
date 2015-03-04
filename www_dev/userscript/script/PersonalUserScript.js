/* global PIOUserScript: false */
/* global dc: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/* global StringUtil: false */
/* global JSGIResponse: false */
/* global Message: false */

function PersonalUserScript(request) {
    this.superclass.constructor.apply(this, [
            request, [
                "POST"
            ]
    ]);
    this.entity = "personal";
}
var PersonalUserScript = CommonUtil.extend(PIOUserScript, PersonalUserScript);

/**
 * パーソナル情報を登録する
 * @param {Object} input 入力データを保持するJSONオブジェクト
 * @returns {JSGIResponse} 処理結果
 */
PersonalUserScript.prototype.create = function(input) {
    var dataJson = input.data;
    this.log('I', 'Start create personal. data=%1', [
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

/**
 * パーソナル情報を更新する
 * @param {Object} input 入力データを保持するJSONオブジェクト
 * @returns {JSGIResponse} 処理結果
 */
PersonalUserScript.prototype.update = function(input) {
    var dataJson = input.data;
    this.log('I', 'Start update personal. data=%1', [
        JSON.stringify(dataJson)
    ]);
    var res = this.cell.box(this.box).odata(this.odata).entitySet(this.entity).update(dataJson);

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

exports.PersonalUserScript = PersonalUserScript;
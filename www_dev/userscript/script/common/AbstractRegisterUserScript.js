/* global PIOUserScript: false */
/* global dc: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/* global StringUtil: false */
/* global JSGIResponse: false */
/* global Message: false */

function AbstractRegisterUserScript(request) {

}
var AbstractRegisterUserScript = CommonUtil.extend(PIOUserScript, AbstractRegisterUserScript);

/**
 * 指定されたJSONデータを登録する。
 * @param {Object} input 入力データを保持するJSONオブジェクト
 * @returns {JSGIResponse} 処理結果
 */
AbstractRegisterUserScript.prototype.create = function(input) {
    var dataJson = input;
    this.log('I', 'Start create process. data=%1', [
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
            "results" : res
        }
    });
    return response;
};

/**
 * 指定されたJSONデータで更新する。
 * @param {Object} input 入力データを保持するJSONオブジェクト
 * @param {String} etag 更新対象のデータのetag値
 * @returns {JSGIResponse} 処理結果
 */
AbstractRegisterUserScript.prototype.update = function(input, etag) {
    var dataJson = input;
    this.log('I', 'Start update process. data=%1, etag=%2', [
            JSON.stringify(dataJson), etag
    ]);
    var user = this.getRequestAccountId();
    this.log("I", "user=" + user);
    var id = dataJson.__id;
    delete dataJson.__id;
    this.cell.box(this.box).odata(this.odata).entitySet(this.entity).update(id, dataJson, etag);

    var response = new JSGIResponse();
    response.status = StatusCode.HTTP_OK;
    response.setResponseData({
        "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
            CommonUtil.getClassName(this)
        ]),
        "d" : {
            "results" : dataJson
        }
    });
    return response;
};

/**
 * 指定されたidの情報を削除する。
 * @param {String} id 削除対象のデータの__idの値
 * @param {String} etag 削除対象のデータのetag値
 * @returns {JSGIResponse} 処理結果
 */
AbstractRegisterUserScript.prototype.destory = function(id, etag) {
    this.log('I', 'Start delete process. id=%1, etag=%2', [
            id, etag
    ]);
    this.cell.box(this.box).odata(this.odata).entitySet(this.entity).del(id, etag);

    var response = new JSGIResponse();
    response.status = StatusCode.HTTP_OK;
    response.setResponseData({
        "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
            CommonUtil.getClassName(this)
        ]),
        "d" : {
            "results" : []
        }
    });
    return response;
};

exports.AbstractRegisterUserScript = AbstractRegisterUserScript;
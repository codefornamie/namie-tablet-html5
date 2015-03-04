/* global PIOUserScript: false */
/* global dc: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/* global StringUtil: false */
/* global JSGIResponse: false */
/* global Message: false */

function RadiationLogUserScript(request) {
    this.superclass.constructor.apply(this, [
            request, [
                "POST"
            ]
    ]);
    this.entity = "radiation_log";
}
var RadiationLogUserScript = CommonUtil.extend(PIOUserScript, RadiationLogUserScript);

/**
 * 放射線情報を登録する
 * @param {Object} input 入力データを保持するJSONオブジェクト
 * @returns {JSGIResponse} 処理結果
 */
RadiationLogUserScript.prototype.create = function(input) {
    var logModels = input.logModels;
    this.log('I', 'Start radiaton logs. count=%1', [
        logModels.length
    ]);
    return this.bulk(logModels);
};
RadiationLogUserScript.prototype.bulk = function(logModels) {
    var responseDataSet = [];
    for (var i = 0; i < logModels.length; i++) {
        var dataJson = logModels[i];
        this.log('I', 'start radiation creation. data=%1', [
            JSON.stringify(dataJson)
        ]);
        var res = this.cell.box(this.box).odata(this.odata).entitySet(this.entity).create(dataJson);
        this.log('I', 'radiation created. response=%1', [
            JSON.stringify(res)
        ]);
        responseDataSet.push(res);
    }
    var response = new JSGIResponse();
    response.status = StatusCode.HTTP_OK;
    response.setResponseData({
        "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
            CommonUtil.getClassName(this)
        ]),
        "d" : {
            "results" : JSON.stringify(responseDataSet)
        }
    });
    return response;
};
RadiationLogUserScript.prototype.batch = function(logModels) {
    var odataBatch = this.cell.box(this.box).odata(this.odata).makeODataBatch(false);
    for (var i = 0; i < logModels.length; i++) {
        var dataJson = logModels[i];
        odataBatch.entitySet(this.entity).createAsJson(dataJson);
    }
    var batchRes = odataBatch.getBatchResponses();

    this.log('I', 'Batch response. count=%1', [
        batchRes.length
    ]);
    var response = new JSGIResponse();
    response.status = StatusCode.HTTP_OK;
    response.setResponseData({
        "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
            CommonUtil.getClassName(this)
        ]),
        "d" : {
            "results" : JSON.stringify(batchRes)
        }
    });
    return response;
};
exports.RadiationLogUserScript = RadiationLogUserScript;
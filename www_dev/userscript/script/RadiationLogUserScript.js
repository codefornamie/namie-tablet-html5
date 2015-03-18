/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global PIOUserScript: false */
/* global com: false */
/* global dc: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/* global StringUtil: false */
/* global JSGIResponse: false */
/* global Message: false */

/**
 * 放射線のログ情報のユーザスクリプトを作成する。
 * <p>
 * 放射線のログ情報の登録処理を行う。
 * </p>
 * @class 放射線のログ情報のユーザスクリプト
 * @param {Object} request リクエスト情報を保持するオブジェクト
 */
function RadiationLogUserScript(request) {
    this.superclass.constructor.apply(this, [
            request, [
                "POST"
            ]
    ]);
    this.entity = "radiation_log";
    // $batchを利用するため、makeODataBatchメソッドをラップする
    dc.Webdav.prototype.odata = function(name) {
        try {
            var coreOData = this.core.odata(name);
            var odataCollection = new dc.ODataCollection(coreOData);
            // このラッパーメソッド追加で、以下のような呼び出しが可能になる
            //  box().odata().makeODataBatch(true)
            odataCollection.makeODataBatch = function(sync) {
                try {
                    var odataBatch = new com.fujitsu.dc.client.ODataBatch(this.core.accessor, coreOData.getPath());
                    return odataBatch;
                } catch (e) {
                    throw new dc.DcException(e.message);
                }
            };
            return odataCollection;
        } catch (e) {
            throw new dc.DcException(e.message);
        }
    };

    dc.OData.prototype.makeODataBatch = function(sync) {
        try {
            return new com.fujitsu.dc.client.ODataBatch(this.core.accessor, this.core.getPath());
            // return this.core.makeODataBatch(sync);
        } catch (e) {
            throw new dc.DcException(e.message);
        }
    };
}
var RadiationLogUserScript = CommonUtil.extend(PIOUserScript, RadiationLogUserScript);

/**
 * 放射線情報を登録する
 * @param {Object} input 入力データを保持するJSONオブジェクト
 * @returns {JSGIResponse} 処理結果
 */
RadiationLogUserScript.prototype.create = function(input) {
    var logModels = input.logModels;
    this.log('I', 'Start RadiationLogUserScript#create. count=%1', [
        logModels.length
    ]);
    // return this.bulk(logModels);
    return this.batch(logModels);
};
/**
 * 指定された放射線のログ情報を一括で登録する。
 * <p>
 * このメソッドは、ODataCollection#createメソッドを利用して、指定された放射線情報を１個ずつ登録する。
 * </p>
 * @param {Array} logModels 放射線ログ情報のJSONオブジェクトの配列
 * @returns {JSGIResponse} 登録結果情報を保持するレスポンス
 */
RadiationLogUserScript.prototype.bulk = function(logModels) {
    var responseDataSet = [];
    this.log('I', 'Start RadiationLogUserScript#bulk. logModels.length = %1', [
        logModels.length
    ]);
    for (var i = 0; i < logModels.length; i++) {
        var dataJson = logModels[i];
        var res = this.cell.box(this.box).odata(this.odata).entitySet(this.entity).create(dataJson);
        responseDataSet.push(res);
    }
    this.log('I', 'radiation log created.', []);
    var response = new JSGIResponse();
    response.status = StatusCode.HTTP_OK;
    response.setResponseData({
        "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
            CommonUtil.getClassName(this)
        ]),
        "d" : {
            "results" : responseDataSet
        }
    });
    return response;
};
/**
 * 指定された放射線のログ情報を一括で登録する。
 * <p>
 * このメソッドは、ODataBatchを利用して、指定された放射線情報を一括で登録する。
 * </p>
 * @param {Array} logModels 放射線ログ情報のJSONオブジェクトの配列
 * @returns {JSGIResponse} 登録結果情報を保持するレスポンス
 */
RadiationLogUserScript.prototype.batch = function(logModels) {
    this.log('I', 'Start RadiationLogUserScript#batch. logModels.length = %1', [
        logModels.length
    ]);
    var odataBatch = this.cell.box(this.box).odata(this.odata).makeODataBatch(true);
    for (var i = 0; i < logModels.length; i++) {
        var dataJson = logModels[i];
        odataBatch.entitySet(this.entity).createAsJson(dc.util.obj2javaJson(dataJson));
    }
    odataBatch.insertBoundary();
    this.log('I', 'Finished OdataBatch preparing.', []);
    odataBatch.send();
    this.log('I', 'Send OdataBatch request.', []);

    // 以下のエラーが発生するため、ODataBatch#getResponses()は呼び出さない。
    // {"message":"InternalError: Access to Java class \"java.lang.Object\" is prohibited. (common#863)"}
    // var batchRes = odataBatch.getResponses();
    // this.log('I', 'Batch response. count=%1', [
    // batchRes.length
    // ]);

    var response = new JSGIResponse();
    response.status = StatusCode.HTTP_OK;
    response.setResponseData({
        "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
            CommonUtil.getClassName(this)
        ]),
        "d" : {
            "results" : logModels
        }
    });
    return response;
};
exports.RadiationLogUserScript = RadiationLogUserScript;
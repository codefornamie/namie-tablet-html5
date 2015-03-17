/* global PIOUserScript: false */
/* global SecurityException: false */
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
 * アカウントIDからパーソナル情報を取得する。
 * @param {String} accountId アカウントID
 * @returns {Object} パーソナル情報のレコード
 */
AbstractRegisterUserScript.prototype.getPersonal = function(accountId) {
    var res = this.cell.box(this.box).odata(this.odata).entitySet("personal").query().filter("loginId eq '" + accountId + "'")
    .top(1).run();
    return res.d.results[0];
};

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
    
    // personal以外の場合は、ownerIdを設定する。
    if(this.entity !== "personal") {
        var personal = this.getPersonal(this.getRequestAccountId());
        dataJson.ownerId = personal.__id;
    }

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
 * 指定されたIDのodataドキュメントのオーナーがログインユーザと一致するか確認する。
 * @param {String} id ドキュメントid
 * @returns {boolean} ログインユーザと一致した場合true
 */
AbstractRegisterUserScript.prototype.isOwn = function(id) {
    var personal = this.getPersonal(this.getRequestAccountId());
    if (this.entity !== "personal") {
        var target = this.cell.box(this.box).odata(this.odata).entitySet(this.entity).retrieve(id);

        return !target.ownerId || (personal.roles != null && personal.roles.split(",").indexOf("admin") >= 0) ||
                target.ownerId === personal.__id;
    } else {
        return id === personal.__id;
    }
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
    
    var id = dataJson.__id;
    delete dataJson.__id;

    // 更新しようとしているレコードに対する更新権限があるかチェックする。
    if(!this.isOwn(id)){
        throw new SecurityException(this.entity, id);
    }

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
/* global dc: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/* global StringUtil: false */
/* global PIOUserScriptException: false */
/* global PIOUnknownException: false */
/* global MethodNotAllowdException: false */
/* global PIOLogger: false */
/* global Message: false */
/* global JSGIResponse: false */
/**
 * personium.ioのユーザスクリプトの基底クラスを作成する。
 * 
 * @class personium.ioのユーザスクリプトの基底クラス
 * @constructor
 * @param {JSGIRequest} request クライアントからのリクエスト情報
 * @param {Array} allowdMethods このユーザスクリプトで許可されているリクエストメソッド
 * @property {Accessor} accessor personium.ioへ接続するためのAccessorのインスタンス
 */
function PIOUserScript(request, allowdMethods) {
    try {
        this.request = request;
        this.accessor = this.getAccessor();
        // このユーザスクリプトが実行されているセルを取得する
        this.cell = this.accessor.cell();
        // このユーザスクリプトが実行されているセルのURLを取得する
        this.cellUrl = this.cell.getUrl();
        // このユーザスクリプトが実行されているセルのIDを取得する
        this.cellId = CommonUtil.getCellNameByUrl(this.cellUrl);

        this.box = 'data';
        this.odata = 'odata';

        // 実行メソッドを取得する
        this.method = CommonUtil.getHttpMethod(request);
        this.allowdMethods = allowdMethods;
        // 初期化
        this.init();

        // URLクエリパラメタを取得する
        this.query = dc.util.queryParse(request.queryString);

        // リクエストボディデータを取得する
        var br = request.input;
        var buff = br.readAll();
        this.body = null;
        if (buff != null) {
            this.body = dc.util.queryParse(buff, 'utf-8');
        }
        this.headers = request.headers;
        // リクエストを発行したアカウントのIDを取得する
        // this.accountId = this.getRequestAccountId();
        // this.log('I', "account id = %1", [
        // this.accountId
        // ]);

        this.log('I', "Start userscript. name = %1", [
            CommonUtil.getClassName(this)
        ]);
    } catch (e) {
        throw new PIOUnknownException(CommonUtil.getClassName(this), e);
    }
}
PIOUserScript.prototype.getAuthorizationToken = function() {
    var authorization = this.headers["authorization"];
    var token = authorization.substring("Bearer ".length);
    this.log('I', "token = %1", [
        token
    ]);
    return token;
};
PIOUserScript.prototype.getRequestAccountId = function() {
    var token = this.getAuthorizationToken();
    var decoredToken = CommonUtil.base64decord(token);

    return decoredToken;
};
/**
 * personium.io へのアクセスオブジェクトを取得する
 * @returns {Accessor} personium.io へのアクセスオブジェクト
 */
PIOUserScript.prototype.getAccessor = function() {
    // serviceSubjectで設定されたアカウントの権限で動作する
    // http://personium.io/docs/
    // (Box Level API > Engineサービスコレクション > サービスコレクション設定 > サービスコレクション設定適用PROPPATCH)
    return dc.as('serviceSubject');
};
/**
 * ユーザスクリプトの初期化処理を行う。
 * <p>
 * 以下の処理を行う。
 * <ul>
 * <li>ログの出力を非同期にする</li>
 * <li>ロガーの初期化</li>
 * </ul>
 * </p>
 */
PIOUserScript.prototype.init = function() {
    // ログの出力を非同期にする
    dc.setThreadable(true);
    // ロガーの初期化
    this.logger = new PIOLogger(this.cell);
};
/**
 * ログを出力する。
 * @param {String} level ログレベル('I' or 'W' or 'E')
 * @param {String} message ログメッセージ。%1から%9までのパラメタを指定可能
 * @param {Array} messageParams ログメッセージパラメタの値。パラメタがない場合、空配列を指定する。
 * @param {Error} error エラー情報
 */
PIOUserScript.prototype.log = function(level, message, messageParams, error) {
    message = Message.getMessage(message, messageParams);
    if (error) {
        // エラー内容をメッセージ付加する
        message += " (" + error.toString() + ")";
    }
    var json = {
        "action" : this.request.method,
        "object" : this.request.pathInfo,
        "result" : message
    };
    switch (level) {
    case 'I':
        this.logger.info(json);
        break;
    case 'W':
        this.logger.warn(json);
        break;
    case 'E':
        this.logger.warn(json);
        break;
    }
};

/**
 * リクエストメソッドがGETの場合に呼び出される。
 * <p>
 * サブクラスは、このメソッドをオーバライドして、GETメソッドの処理を実装する。
 * </p>
 * 
 * @param {JSGIRequest} request クライアントからのリクエスト情報
 * @returns {JSGIResponse} 処理結果
 */
PIOUserScript.prototype.get = function(request) {
    return null;
};

/**
 * リクエストメソッドがPUTの場合に呼び出される。 サブクラスは、このメソッドをオーバライドして、PUTメソッドの処理を実装する。
 * 
 * @param {JSGIRequest} request クライアントからのリクエスト情報
 * @returns {JSGIResponse} 処理結果
 */
PIOUserScript.prototype.put = function(request) {
    // 入力チェック処理を呼び出す
    this.updateValidation();

    // リクエストボディをJSONオブジェクトに変換する
    var input = null;
    if (this.body.d !== undefined) {
        input = JSON.parse(this.body.d);
    }

    var response = this.update(input, this.body.etag);

    if (response) {
        // 明示されたレスポンスがあれば、それを返す。
        return response;
    } else {
        // なければ、デフォルトの正常終了レスポンスを返す
        response = new JSGIResponse();
        response.status = StatusCode.HTTP_OK;
        response.setResponseData({
            "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
                CommonUtil.getClassName(this)
            ])
        });
        return response;
    }
};

/**
 * UserScriptがPOSTメソッドで呼び出された場合の処理を行う。
 * <p>
 * 実際の登録処理は、PIOUserScript#createメソッドに実装する。
 * </p>
 * @returns {JSGIResponse} 処理結果
 */
PIOUserScript.prototype.post = function() {
    // 入力チェック処理を呼び出す
    this.createValidation();

    // リクエストボディをJSONオブジェクトに変換する
    var input = null;
    if (this.body.d !== undefined) {
        input = JSON.parse(this.body.d);
    }

    var response = this.create(input);

    if (response) {
        // 明示されたレスポンスがあれば、それを返す。
        return response;
    } else {
        // なければ、デフォルトの正常終了レスポンスを返す
        response = new JSGIResponse();
        response.status = StatusCode.HTTP_OK;
        response.setResponseData({
            "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
                CommonUtil.getClassName(this)
            ])
        });
        return response;
    }
};
/**
 * 登録処理リクエストの入力パラメタのチェックを行う。
 * <p>
 * サブクラスは、このメソッドをオーバライドして、登録処理での入力チェックを実装する。
 * </p>
 */
PIOUserScript.prototype.createValidation = function() {

};
/**
 * 更新処理リクエストの入力パラメタのチェックを行う。
 * <p>
 * サブクラスは、このメソッドをオーバライドして、更新処理での入力チェックを実装する。
 * </p>
 */
PIOUserScript.prototype.updateValidation = function() {

};
/**
 * 登録処理を行う。
 * <p>
 * サブクラスは、このメソッドをオーバライドして、登録処理を実装する。
 * </p>
 * @param {Object} input 入力データ
 * @returns {JSGIResponse} 処理結果
 */
PIOUserScript.prototype.create = function(input) {

};
/**
 * リクエストメソッドがDELETEの場合に呼び出される。
 * <p>
 * サブクラスは、このメソッドをオーバライドして、DELETEメソッドの処理を実装する。
 * </p>
 * 
 * @param {JSGIRequest} request クライアントからのリクエスト情報
 * @returns {JSGIResponse} 処理結果
 */
PIOUserScript.prototype.del = function(request) {
    // 入力チェック処理を呼び出す
    this.deleteValidation();

    // リクエストボディをJSONオブジェクトに変換する
    var input = null;
    if (this.body.d !== undefined) {
        input = JSON.parse(this.body.d);
    }

    var response = this.destory(input, this.body.etag);

    if (response) {
        // 明示されたレスポンスがあれば、それを返す。
        return response;
    } else {
        // なければ、デフォルトの正常終了レスポンスを返す
        response = new JSGIResponse();
        response.status = StatusCode.HTTP_OK;
        response.setResponseData({
            "message" : Message.getMessage("Script execution finished successfully. UserScript: %1", [
                CommonUtil.getClassName(this)
            ])
        });
        return response;
    }
};
/**
 * 削除処理リクエストの入力パラメタのチェックを行う。
 * <p>
 * サブクラスは、このメソッドをオーバライドして、削除処理での入力チェックを実装する。
 * </p>
 */
PIOUserScript.prototype.deleteValidation = function() {

};
/**
 * クライアントから指定されたリクエストメソッドに対応するメソッドを呼び出す。
 * 
 * @returns {JSGIResponse} 呼び出したメソッドの処理結果
 */
PIOUserScript.prototype.dispatch = function() {
    // リクエストのメソッドチェック
    var found = false;
    for (var i = 0; i < this.allowdMethods.length; i++) {
        if (this.allowdMethods[i] === this.method) {
            found = true;
            break;
        }
    }
    if (!found) {
        throw new MethodNotAllowdException(this.method, this.allowdMethods);
    }

    // リクエストメソッドに対応するメソッドを呼び出す
    if (this.method === "POST") {
        return this.post();
    } else if (this.method === "PUT") {
        return this.put();
    } else if (this.method === "GET") {
        return this.get();
    } else if (this.method === "DELETE") {
        return this.del();
    } else {
        throw new MethodNotAllowdException(this.method, this.allowdMethods);
    }
};

/**
 * ユーザスクリプトの処理中に、予期しないエラーが発生した場合のクライアントへ返却するレスポンスデータを作成する。
 * 
 * @param e 発生したエラー
 * @returns {JSGIResponse} エラー情報が含まれるレスポンスデータ
 */
PIOUserScript.prototype.createUnkwownErrorResponse = function(e) {
    var response = new JSGIResponse();

    response.status = StatusCode.HTTP_INTERNAL_SERVER_ERROR;
    response.setResponseData({
        "message" : e.toString()
    });

    return response;
};

/**
 * ユーザスクリプトの処理中に、dc1-engineが例外をスローした際に、クライアントへ返却するレスポンスデータを作成する。
 * 
 * @param engineException dc1-engineがスローした例外
 * @returns {JSGIResponse} エラー情報が含まれるレスポンスデータ
 */
PIOUserScript.prototype.createEngineErrorResponse = function(engineException) {
    var response = new JSGIResponse();

    var statusCode = String(engineException.code);
    var message;
    if (statusCode.charAt(0) == '3' || statusCode.charAt(0) == '4') {
        // DC-Engineが、300～400番台のステータスコードで終了した場合
        // クライアントの操作エラーとして処理する
        response.status = statusCode;
        message = Message.getMessage('ClientError occured in dc1-engine process. message=%1', [
            engineException.toString()
        ]);
        this.log('I', message, [], this.method, this.request.queryString, engineException);
    } else {
        // 300、400以外のエラーが発生した場合
        response.status = StatusCode.HTTP_INTERNAL_SERVER_ERROR;
        message = Message.getMessage('Error occured in dc1-engine process. message=%1', [
            engineException.toString()
        ]);

        this.log('E', message, [], this.method, this.request.queryString, engineException);
    }

    response.setResponseData({
        "message" : message
    });

    return response;
};

/**
 * personium.io ユーザスクリプトの処理を開始する。
 * <p>
 * クライアントからのリクエストメソッドに対応するユーザスクリプトの処理を実行し、その結果が含まれるJSGIResponseを返却する。<br>
 * 処理中にエラーが発生した場合、そのエラー内容が含まれるJSGIResponseを返却する。
 * </p>
 * 
 * @returns {JSGIResponse} 処理結果
 */
PIOUserScript.prototype.execute = function() {
    try {
        return this.dispatch();
    } catch (e) {
        if (e instanceof PIOUserScriptException) {
            this.log('I', "PIOUserScriptException occured. exception = %1", [
                e.toString()
            ]);
            return e.serialize();
        } else if (CommonUtil.isEngineException(e)) {
            this.log('I', "EngineException occured. exception = %1", [
                e.toString()
            ]);
            return this.createEngineErrorResponse(e);
        } else {
            this.log('E', "UnkwownException occured. exception = %1", [
                e.toString()
            ]);
            return this.createUnkwownErrorResponse(e);
        }
    }
};
exports.PIOUserScript = PIOUserScript;

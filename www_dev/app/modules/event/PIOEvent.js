define(function(require, exports, module) {
    "use strict";
    var app = require("app");
    var AbstractEvent = require("modules/event/AbstractEvent");

    /**
     * personium.ioのAPI操作イベントのクラスを作成する。
     * @class personium.ioのOData操作イベントのクラス
     * @constructor
     */
    var PIOEvent = AbstractEvent.extend({
        /**
         * 初期化
         * @memberOf PIOEvent#
         */
        init : function(response) {
            this.status = 200;
            if (!response) {
                return;
            }
            this.response = response;
            this.networkError = false;
            if (response.httpClient) {
                this.status = response.httpClient.status;
                if (this.status === 0) {
                    this.networkError = true;
                }
                // リクエストURL
                this.requestUrl = response.httpClient.requestUrl;
            }
            var json = null;
            if (response.bodyAsJson) {
                try {
                    json = response.bodyAsJson();
                } catch (e) {
                    json = {d: {results: []}};
                }
                if (json && json.d) {
                    this.json = json.d.results;
                }
                this.json = json;
                if (json) {
                    // APIの応答コード
                    this.code = json.code;
                    // APIの応答メッセージ
                    if (json.message) {
                        if (json.message.value) {
                            // OData APIアクセスの場合、valueにメッセージ本文がある
                            this.message = json.message.value;
                        } else {
                            this.message = json.message;
                            // UserScript の場合、causeにもメッセージが入る
                            if (json.cause) {
                                this.message += " cause=" + JSON.stringify(json.cause);
                            }
                        }
                        
                    }
                }
            } else {
                // response.bodyAsJson を持たない場合
                // WebDAV APIのレスポンスは、返却値がXMLのため、こちらの処理が通る
                if (response.code) {
                    if (typeof response.code === 'string') {
                        var status = response.code.match(/[0-9]{3}?/);
                        if (status) {
                            this.status = parseInt(status[0]);
                        }
                        this.message = response.message;
                        this.code = response.code;
                    } else {
                        // ネットワークエラーが発生した場合
                        // response.codeは数値となり、HTTPステータスが入らないため、明示的に0をいれる
                        this.status = 0;
                        this.message = response.name + ": " + response.message;
                        this.code = response.code;
                    }

                }
            }
            this._super(this.code, this.message);
        }
    });
    /**
     * API操作が成功したかどうか。
     * @returns {Boolean} 成功した場合、<code>true</code>を返す
     */
    PIOEvent.prototype.isSuccess = function() {
        app.logger.debug("status" + this.status);
        if (200 <= this.status && this.status < 300) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * API操作が失敗したかどうか。
     * @returns {Boolean} 失敗した場合、<code>true</code>を返す
     */
    PIOEvent.prototype.isError = function() {
        return !this.isSuccess();
    };
    /**
     * 対象のAPI呼び出し時に通信失敗によるエラーが発生したかどうか。
     * 
     * @memberOf PIOEvent#
     * @return {Boolean} 対象のAPI呼び出し時に通信失敗によるエラーが発生した場合、<code>true</code>を返す。
     */
    PIOEvent.prototype.isNetworkError = function() {
        return this.status === 0;
    };
    /**
     * 対象のAPI呼び出し結果が401となったかどうか。
     * 
     * @memberOf PIOEvent#
     * @return {Boolean} 対象のAPI呼び出し結果が401の場合、<code>true</code>を返す。
     */
    PIOEvent.prototype.isLacksPrivilege = function() {
        return this.status === 401 || this.status === 403;
    };
    /**
     * 対象のAPI呼び出し結果が503となったかどうか。
     * 
     * @memberOf PIOEvent#
     * @return {Boolean} 対象のAPI呼び出し結果が503の場合、<code>true</code>を返す。
     */
    PIOEvent.prototype.isServerBusy = function() {
        return this.status === 503;
    };
    /**
     * 対象のAPI呼び出し結果が404 NotFoundとなったかどうか。
     * 
     * @memberOf PIOEvent#
     * @return {Boolean} 対象のAPI呼び出し結果が404 NotFoundの場合、<code>true</code>を返す。
     */
    PIOEvent.prototype.isNotFound = function() {
        return this.status === 404;
    };
    /**
     * 対象のAPI呼び出し結果が他のユーザーの操作と競合したかどうか。
     * 
     * @memberOf PIOEvent#
     * @return {Boolean} 対象のAPI呼び出しが他のユーザーと競合した場合、<code>true</code>を返す。
     */
    PIOEvent.prototype.isConflict = function() {
        return this.status === 412 || this.status === 409;
    };
    /**
     * このイベントの文字列情報を取得する
     * @memberOf PIOEvent#
     * @return {String} このイベントの文字列情報
     */
    PIOEvent.prototype.toString = function() {
        return "PIOEvent [status:" + this.status + ", code:" + this.code + ", message:" + this.message +
                ", requestUrl:" + this.requestUrl + "]";
    };
    module.exports = PIOEvent;
});

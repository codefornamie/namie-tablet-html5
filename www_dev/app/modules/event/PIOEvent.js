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
                json = response.bodyAsJson();
            }
            if (json && json.d) {
                json = json.d.results;
            }
            this.json = json;
            if (this.json) {
                // APIの応答コード
                this.code = this.json.code;
                // APIの応答メッセージ
                if (this.json.message) {
                    this.message = this.json.message.value;
                }
                this._super(this.code, this.message);
            }
        }
    });
    /**
     * API操作が成功したかどうか。
     * @returns {Boolean} 成功した場合、<code>true</code>を返す
     */
    PIOEvent.prototype.isSuccess = function() {
        if (200 <= this.status && this.status < 300) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * 対象のAPI呼び出し時に通信失敗によるエラーが発生したかどうか。
     * 
     * @memberOf PIOEvent#
     * @return {Boolean} 対象のAPI呼び出し時に通信失敗によるエラーが発生した場合、<code>true</code>を返す。
     */
    PIOEvent.prototype.isNetworkError = function() {
        return this.networkError;
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

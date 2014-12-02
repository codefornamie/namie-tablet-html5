define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    /**
     * It creates a new object CustomHttpClient.
     * @class This class is the abstraction Layer of HTTP Client.
     * @param {Boolean} async true value represents asynchronous mode
     */
    var CustomHttpClient = function(async) {
        this.super = new dcc.http.DcHttpClient();
    };

    CustomHttpClient.prototype.setResponseType = function(type) {
        return this.super.httpClient.responseType = type;
    };

    /**
     * This method sets the HTTP Request Header.
     * @param {String} header key
     * @param {String} header value
     */
    CustomHttpClient.prototype.setRequestHeader = function(key, value) {
        return this.super.setRequestHeader(key, value);
    };

    /**
     * This method sets overrideMimeType.
     * @param {String} MimeType value
     */
    CustomHttpClient.prototype.setOverrideMimeType = function(value) {
        return this.super.setOverrideMimeType(value);
    };

    /**
     * This method is the getter for HTTP Status Code.
     * @returns {String} HTTP Status Code
     */
    CustomHttpClient.prototype.getStatusCode = function() {
        return this.super.getStatusCode();
    };

    /**
     * Thi smethod gets the specified response header value.
     * @param {String} header name
     * @returns {String} header value
     */
    CustomHttpClient.prototype.getResponseHeader = function(key) {
        return this.super.getResponseHeader(key);
    };

    /**
     * This method gets all the response headers.
     * @returns {Object} response header
     */
    CustomHttpClient.prototype.getAllResponseHeaders = function() {
        return this.super.getAllResponseHeaders();
    };

    /**
     * This method retrieves the response body in the form of string.
     * @returns {String} responseText
     */
    CustomHttpClient.prototype.bodyAsString = function() {
        return this.super.bodyAsString();
    };

    /**
     * This method retrieves the response body in the form of binary.
     * @returns {Object} response object
     */
    CustomHttpClient.prototype.bodyAsBinary = function() {
        return this.super.bodyAsBinary();
    };

    /**
     * This method retrieves the response body in the form of JSON object.
     * @returns {Object} responseText JSON format
     */
    CustomHttpClient.prototype.bodyAsJson = function() {
        return this.super.bodyAsJson();
    };

    /**
     * This method retrieves the response body in the form of XML.
     * @return {String} XML DOM Object
     */
    CustomHttpClient.prototype.bodyAsXml = function() {
        return this.super.bodyAsXml();
    };

    /**
     * AccountManagerにアカウントが登録されていればトークンの取得を行う。
     * @memberOf CustomHttpClient
     * @param {Function} callback トークン取得成功時のコールバック
     */
    CustomHttpClient.prototype.getAuthToken = function(callback) {
        if (window.plugins) {
            this.accountManager = window.plugins.accountmanager;
        }
        if ((app.accessToken) && (app.expirationDate)) {
            var margin = 300 * 1000;
            var now = (new Date()).getTime();
            if (now < (parseInt(app.expirationDate) - margin)) {
                alert("ExpiresIn 期間内 : now(" + now + ")/expire(" + app.expirationDate + ")");
                callback("token", app.accessToken);
                return;
            } else {
                if (!this.accountManager) {
                    // Refresh
                } else {
                    // AcctounManagerから
                }
            }
        } else {
            // なに？
        }
        if (!this.accountManager) {
            console.log("account manager undefined (not android)");
            callback("showLoginView", app.accessToken);
            return;
        }

        // alert("アカウントマネージャ認証開始");
        this.accountManager.getAccountsByType(this.packageName, $.proxy(function(error, accounts) {
            // alert("アカウントマネージャチェック終了 : " + accounts.length + "件");
            console.log("account manager getAccountsByType method responsed ");
            if (error) {
                console.log("account manager error : " + error);
                callback("showLoginView", "");
                return;
            } else if (!accounts || !accounts.length) {
                console.log("this device has no accounts");
                callback("showLoginView", "");
                return;
            }
            var account = accounts[0];

            // 認証トークンを取得する
            this.accountManager.getAuthToken(0, "oauth", $.proxy(function(error, token) {
                alert("トークン取得成功 : " + token);
                console.log("account manager getAuthToken responsed : " + token);
                if (error) {
                    callback("error", error);
                    return;
                }
                // トークンの有効期限(expires-in)を取得する
                this.accountManager.getUserData(account, "ExpiresIn", $.proxy(function(error, data) {
                    if (error) {
                        alert("Error getUserData " + error);
                        callback("error", error);
                        return;
                    }
                    app.expirationDate = data;
                    app.accessToken = token;
                    alert(app.expirationDate);
                    alert(app.accessToken);
                    // 次回はキャッシュされたトークンが取得されないように、キャッシュをクリアする
                    this.accountManager.invalidateAuthToken(this.packageName, app.accessToken, function(error) {
                        if (error) {
                            console.log("error invalidateAuthToken for AccountManager");
                        }
                    });
                    callback("token", token);
                }, this));
            }, this));
        }, this));
    },

    /**
     * Execute method is used to send an HTTP Request.
     * @private
     * @param {String} method
     * @param {String} requestUrl
     * @param {Object} requestBody
     * @param {Object} callback
     * @returns {dcc.Promise} Promise object
     */
    CustomHttpClient.prototype._execute = function(method, requestUrl, requestBody, callback) {
        console.log("☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★");

        this.getAuthToken($.proxy(function(type, token) {
            if (token) {
                var authHeader = {};
                authHeader["Authorization"] = "Bearer " + token;
                for ( var index in this.super.requestHeaders) {
                    var header = this.super.requestHeaders[index];
                    for ( var key in header) {
                        if (key === "Authorization") {
                            this.super.requestHeaders[index] = authHeader;
                            continue;
                        }
                    }
                }
            }
            return this.super._execute(method, requestUrl, requestBody, callback);
        }, this));
    };

    /**
     * Execute method is used to send an HTTP Request, decides request mode based on this.async.
     * @private
     * @param {String} method GET, POST, PUT,DELETE
     * @param {String} requestUrl
     * @param {Object} options contains body and callback success, error and complete
     * @param {accessor} to set response header
     * @returns {dcc.Promise} Promise object
     */
    CustomHttpClient.prototype._execute2 = function(method, requestUrl, options, accessor) {
        return this.super._execute2(method, requestUrl, options, accessor);
    };

    /**
     * This method sets Asynchronous mode.
     * @param {Boolean} async true to set mode as asynchronous
     */
    CustomHttpClient.prototype.setAsync = function(async) {
        return this.super.setAsync(async);
    };
    module.exports = CustomHttpClient;

});

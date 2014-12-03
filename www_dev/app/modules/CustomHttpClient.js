define(function(require, exports, module) {
    "use strict";

    var Log = require("modules/util/logger");

    /**
     * It creates a new object CustomHttpClient.
     * @class This class is the abstraction Layer of HTTP Client.
     * @param {Boolean} async true value represents asynchronous mode
     */
    var CustomHttpClient = function(async, app) {
        this.app = app;
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
     * Execute method is used to send an HTTP Request.
     * @private
     * @param {String} method
     * @param {String} requestUrl
     * @param {Object} requestBody
     * @param {Object} callback
     * @returns {dcc.Promise} Promise object
     */
    CustomHttpClient.prototype._execute = function(method, requestUrl, requestBody, callback) {
        Log.info("HtppClient.execute called");
        this.updateAuthrizationRequestHeader($.proxy(function() {
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
        Log.info("HtppClient.execute2 called");
        this.updateAuthrizationRequestHeader($.proxy(function() {
            return this.super._execute2(method, requestUrl, options, accessor);
        }, this));
    };

    /**
     * トークンの更新があった場合、トークンを差し替える。
     * @param {Function} callback
     */
    CustomHttpClient.prototype.updateAuthrizationRequestHeader = function(callback) {
        this.app.pcsManager.ready($.proxy(function() {
            if (this.app.pcsManager.accessToken) {
                Log.info("Token found.");
                var authHeader = {};
                authHeader["Authorization"] = "Bearer " + this.app.pcsManager.accessToken;
                for ( var index in this.super.requestHeaders) {
                    var header = this.super.requestHeaders[index];
                    for ( var key in header) {
                        if (key === "Authorization") {
                            Log.info("Override Authorization request header");
                            this.super.requestHeaders[index] = authHeader;
                            continue;
                        }
                    }
                }
            }
            callback();
        }, this));
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

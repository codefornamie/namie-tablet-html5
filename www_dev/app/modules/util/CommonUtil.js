define(function(require, exports, module) {
    "use strict";
    var Code = require("modules/util/Code");

    /**
     * 汎用ユーティリティクラス
     * @class 汎用ユーティリティクラス
     * @constructor
     */
    var CommonUtil = function() {

    };
    /**
     * 文字列をコンテンツに表示できる形に置換する
     * 
     * @memberOf CommonUtil#
     * @param {String} str 対象となる文字列
     * @return {String} 置換された文字列
     */
    CommonUtil.sanitizing = function(str) {
        if (str && typeof str === "string") {
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\r\n]/g, '<br />');
        } else {
            return str;
        }
    };
    /**
     * 文字列の半角スペースを削除する。。
     * 
     * @param {String} str 文字列
     * @return {String} 半角スペースを削除した文字列
     * @memberOf CommonUtil#
     */
    CommonUtil.blankTrim = function(str) {
        if (str && typeof str === "string") {
            return str.replace(/ /g, "");
        }
        return str;
    };
    /**
     * アプリがCordova上で動作しているかどうかかを判定する。
     * 
     * @return {String} Cordovaで動作している場合、<code>true</code>を返す。
     * @memberOf CommonUtil#
     */
    CommonUtil.isCordova = function() {
        console.log("window.cordova:" + window.cordova);
        return window.cordova !== undefined;
    };
    /**
     * アプリがCordova上で動作している、かつ、Cordovaが利用可能な状態どうかを判定する。
     * 
     * @return {String} Cordovaが利用可能な場合、<code>true</code>を返す。
     * @memberOf CommonUtil#
     */
    CommonUtil.isCordovaRunning = function() {
        console.log("window.device:" + window.device);
        return CommonUtil.isCordova() && window.device !== undefined;
    };
    /**
     * アプリモードごとに、キャッシュの有効無効を判定する。
     * 
     * @return {String} mode アプリモード
     * @memberOf CommonUtil#
     */
    CommonUtil.useCache = function(mode) {
        var useCache = Code.CACHE_MODE[mode];
        if (useCache === undefined) {
            useCache = false;
        }
        return useCache;
    };
    module.exports = CommonUtil;
});

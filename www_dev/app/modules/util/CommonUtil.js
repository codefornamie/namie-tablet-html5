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
    /**
     * JSONオブジェクトをCSV出力できるデータに変換する
     * @param {Object} json JSON形式のオブジェクト
     * @return {String} csvData CSV変換後のデータ
     * @memberOf CommonUtil#
     */
    CommonUtil.convertCsvData = function(json) {
        // 項目毎の区切り文字
        var colDelim = ",";
        // レコード毎の改行文字
        var rowDelim = "\r\n";
        var csv = "";
        var titleArray = [];
        // 最初のレコードから項目を取得
        for ( var title in json[0]) {
            titleArray.push(title);
        }

        var line = "";
        // 項目行作成
        for (var i = 0; i < titleArray.length; i++) {
            if (line !== '') {
                line += colDelim;
            }
            line = line + "\"" + titleArray[i] + "\"";
        }
        csv += line + rowDelim;

        // レコード行作成
        for (var j = 0; j < json.length; j++) {
            var dataArray = [];
            for ( var index in json[j]) {
                var titleIndex = titleArray.indexOf(index);
                if (json[j][index]) {
                    dataArray[titleIndex] = "\"" + json[j][index].replace(/"/g, '""') + "\"";
                } else {
                    dataArray[titleIndex] = "\"\"";
                }
            }
            for (var k = 0; k < titleArray.length; k++) {
                if (dataArray[k]) {
                    csv += dataArray[k];
                } else {
                    csv += "\"\"";
                }
                if (k !== titleArray.length - 1) {
                    csv += colDelim;
                }
            }
            csv += rowDelim;
        }
        return csv;
    };
    module.exports = CommonUtil;
});

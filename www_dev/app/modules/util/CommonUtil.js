define(function(require, exports, module) {
    "use strict";
    var Code = require("modules/util/Code");
    var CSV = require("CSV");

    /**
     * 汎用ユーティリティクラス
     * @class 汎用ユーティリティクラス
     * @constructor
     */
    var CommonUtil = function() {

    };
    /**
     * 配列を、指定された数ずつ分割する
     * @param targetArray
     * @param eachOf
     * @returns {Array}
     */
    CommonUtil.sliceArray = function(targetArray, eachOf) {
        var b = targetArray.length;
        var slicedArray = [];

        for (var i = 0; i < Math.ceil(b / eachOf); i++) {
            var j = i * eachOf;
            var p = targetArray.slice(j, j + eachOf);
            slicedArray.push(p);
        }
        return slicedArray;
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
     * baseURLとhrefからURLを求める
     * 
     * @memberOf CommonUtil#
     * @param {String} baseUrl ベースとなるURL
     * @param {String} href aタグのhref
     * @return {String} 求められたURL。hrefがURLではない場合はnullを返す。
     */
    CommonUtil.resolveUrl = function(baseUrl, href) {
        var hrefParts = href.match(/^(\w*:\/\/[^/]*)?\/?(.*)/);
        // URLではない場合は、nullを返す。
        if (hrefParts[2].indexOf(":") >= 0) {
            return null;
        }
        // hrefが完全形式のURLで指定してある場合はそのまま返却する。
        if (hrefParts[1]) {
            return href;
        }
        var baseParts = baseUrl.match(/^(\w*:\/\/[^/]*)?\/?(.*)/);
        var hrefPaths = hrefParts[2].split("/");
        var basePaths = baseParts[2].split("/");
        // hrefが絶対パス指定の場合は、baseUrlのプロトコル、ホスト名部分とhrefを結合して返す。
        if (href.charAt(0) === "/") {
            return baseParts[1] + href;
        }
        // hrefが相対パスの場合
        basePaths.pop();
        for (var i = 0; i < hrefPaths.length; i++) {
            var path = hrefPaths[i];
            if (path === "..") {
                basePaths.pop();
            } else {
                basePaths.push(path);
            }
        }

        return baseParts[1] + "/" + basePaths.join("/");
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
            line = line + titleArray[i];
        }
        csv += line + rowDelim;

        // レコード行作成
        for (var j = 0; j < json.length; j++) {
            var dataArray = [];
            for ( var index in json[j]) {
                var titleIndex = titleArray.indexOf(index);
                if (json[j][index]) {
                    dataArray[titleIndex] = json[j][index];
                } else {
                    dataArray[titleIndex] = "";
                }
            }
            for (var k = 0; k < titleArray.length; k++) {
                if (dataArray[k]) {
                    csv += dataArray[k];
                } else {
                    csv += "";
                }
                if (k !== titleArray.length - 1) {
                    csv += colDelim;
                }
            }
            csv += rowDelim;
        }
        return csv;
    };
    /**
     * csv形式のテキストをJson型オブジェクトに変換する
     * 
     * @return {String} csv
     * @memberOf CommonUtil#
     */
    CommonUtil.convertJsonObject = function(csv, opt) {
        opt = _.defaults(opt || {}, {
            header : true
        });

        return new CSV(csv, opt).parse();
    };
    /**
     * URL形式の文字列をアンカータグ表記に置換する（タグ内パターン文字列は置き換えない）
     * 
     * @return {String} targetStr 置換対象文字列
     * @memberOf CommonUtil#
     */
    CommonUtil.replaceURLtoAnchor = function(targetStr) {
        if (targetStr && typeof targetStr === "string") {
            var replacer = function(str, str2, offset, allStr) {
                // 全文とパターン一致した文字およびその文字列のインデックスを掛けあわせて
                // タグ内にある文字列かどうかを判断する
                var greater = allStr.indexOf('>', offset);
                var lesser = allStr.indexOf('<', offset);

                if (greater < lesser || (greater != -1 && lesser == -1)) {
                    // タグ内の文字列は置換を行わない
                    return str;
                } else {
                    return '<a href="' + str + '">' + str + '</a>';
                }
            }
            return targetStr.replace(/((?:https?):\/\/[-_.!~*\'()a-zA-Z0-9;\/?:@&=+$,%#]+)/g, replacer);
        }
        return targetStr;
    };

    module.exports = CommonUtil;
});

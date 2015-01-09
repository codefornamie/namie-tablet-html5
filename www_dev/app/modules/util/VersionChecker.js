define(function(require, exports, module) {
    "use strict";

    var CommonUtil = require("modules/util/CommonUtil");
    /**
     * アプリケーションのバージョンチェック処理を行うクラスを生成する。
     * @class アプリケーションのバージョンチェック処理を行うクラス
     * @constructor
     */
    var VersionChecker = function() {

    };
    /**
     * バージョンチェック処理を行う。
     * 
     * @param {Function} complete バージョンチェック結果を返すコールバック関数
     * 
     * @memberOf VersionChecker#
     */
    VersionChecker.check = function(complete) {
        if (CommonUtil.isCordovaRunning() === undefined || document.location.protocol !== "file:" ||
                window.cordova.getAppVersion === undefined) {
            console.log("VersionChecker: CommonUtil.isCordovaRunning():" + CommonUtil.isCordovaRunning());
            console.log("VersionChecker: document.location.protocol:" + document.location.protocol);
            console.log("VersionChecker: window.cordova.getAppVersion:" + window.cordova.getAppVersion);
            // Cordovaアプリでない場合、またはローカルビルドされたCordovaアプリの場合、チェックしない
            console.log("Not Cordova. Skip version check.");
            complete(true);
            return;
        }
        // Androidアプリのバージョンを取得する
        window.cordova.getAppVersion().then(function(version) {
            // personium.io上のバージョン情報を取得する
            $.get("config.xml", function(xml) {
                var latestVersion = $(xml).find("widget").attr("version");
                console.log("latestVersion:" + latestVersion);
                complete(latestVersion === version);
            }, "xml").fail(function(jqxhr, textStatus, error) {
                console.log("version.json not found." + textStatus);
                // version情報ファイルが存在しない場合、バージョンチェックはスルーする
                complete(true);
            });
        });
    };
    module.exports = VersionChecker;
});

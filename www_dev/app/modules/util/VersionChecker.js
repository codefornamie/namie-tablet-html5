/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
        if (CommonUtil.isCordovaRunning() === false || window.cordova.getAppVersion === undefined) {
            console.log("VersionChecker: CommonUtil.isCordovaRunning():" + CommonUtil.isCordovaRunning());
            console.log("VersionChecker: document.location.protocol:" + document.location.protocol);
            console.log("VersionChecker: window.cordova.getAppVersion:" + window.cordova.getAppVersion);
            // Cordovaアプリでない場合、またはローカルビルドされたCordovaアプリの場合、チェックしない
            console.log("Not Cordova. Skip version check.");
            complete(true);
            return;
        }

        // Androidアプリのバージョンを取得する
        window.cordova.getAppVersion(function(version) {
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
        }, function() {
            // Versionチェック処理でエラーが発生した場合はアプリを起動する
            console.log("AppVersion plugin not valid. Skip version check.");
            complete(true);
        });
    };
    module.exports = VersionChecker;
});

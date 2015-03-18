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

    var Class = require("modules/util/Class");
    var log4javascript = require("log4javascript");
    var PIOLogAppender = require("modules/util/logging/PIOLogAppender");

    /**
     * なみえタブレットアプリのロガーを作成する。
     * <p>
     * ログ出力を行うための機能を提供する。<br>
     * ログ設定は、resources/appConfig.js のloggerに定義する。
     * </p>
     * @class なみえタブレットアプリのロガークラス
     * @exports Logger
     * @constructor
     */
    var Logger = Class.extend({
        /**
         * コンストラクタ。
         * @param {Object} app app.jsのインスタンス。アプリケーションの設定情報を参照するために利用される。
         * @memberOf Logger#
         */
        init : function(app) {
            // ロガー初期化
            // ロガー名は、namie-${mode}
            var logger = log4javascript.getLogger("namie-" + app.config.basic.mode);

            // ログフォーマット
            var patternLayout = new log4javascript.PatternLayout(app.config.logger.patternLayout);
            // ログレベル (デフォルトはINFO)
            var level = log4javascript.Level.INFO;

            switch (app.config.logger.threshold) {
            case "DEBUG":
                level = log4javascript.Level.DEBUG;
                break;
            case "INFO":
                level = log4javascript.Level.INFO;
                break;
            case "WARN":
                level = log4javascript.Level.WARN;
                break;
            case "ERROR":
                level = log4javascript.Level.ERROR;
                break;
            }

            if (app.config.logger.useConsoleLog) {
                // ConsoleAppenderをロガーに登録する
                var browserConsoleAppender = new log4javascript.BrowserConsoleAppender();
                browserConsoleAppender.setLayout(patternLayout);
                browserConsoleAppender.setThreshold(level);

                logger.addAppender(browserConsoleAppender);
            }

            // personimu.ioのログAPIのAppenderを設定する
            var piologAppender = new PIOLogAppender(app);
            piologAppender.setLayout(patternLayout);
            piologAppender.setThreshold(level);
            piologAppender.setSessionId(app.sessionId);
            piologAppender.onFailed = function(logEvent) {
                // ログAPIのログ書き込みが失敗した場合に呼び出される。
                logger.debug("Failed to personium.io Logging.");
            };
            logger.addAppender(piologAppender);
            this.logger = logger;
        }
    });
    /**
     * DEBUGレベルのログを出力する。
     * @param {String} message ログメッセージ
     * @memberOf Logger#
     */
    Logger.prototype.debug = function(message) {
        this.logger.debug(message);
    };
    /**
     * INFOレベルのログを出力する。
     * @param {String} message ログメッセージ
     * @memberOf Logger#
     */
    Logger.prototype.info = function(message) {
        this.logger.info(message);
    };
    /**
     * WARNレベルのログを出力する。
     * @param {String} message ログメッセージ
     * @memberOf Logger#
     */
    Logger.prototype.warn = function(message) {
        this.logger.warn(message);
    };
    /**
     * ERRORレベルのログを出力する。
     * @param {String} message ログメッセージ
     * @param {Error} e Errorオブジェクト
     * @memberOf Logger#
     */
    Logger.prototype.error = function(message, e) {
        this.logger.error(message, e);
    };
    /**
     * セッションIDを作成する。
     * <p>
     * 以下の文字列から生成されるセッションIDを新規に作成する。<br>
     * <ul>
     * <li>'abcdefghijklmnopqrstuvwxyz'</li>
     * <li>'ABCDEFGHIJKLMNOPQRSTUVWXYZ'</li>
     * <li>'0123456789'</li>
     * </ul>
     * 上記以外の文字をセッションIDに含めたい場合、bパラメタに文字を指定する。
     * </p>
     * 
     * @param {Number} セッションIDの桁数
     * @param {String} セッションIDに追加で含める文字
     * @return {String} セッションID
     * @memberOf Logger#
     */
    Logger.createSessionId = function(n, b) {
        b = b || '';
        var a = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789' + b;
        a = a.split('');
        var s = '';
        for (var i = 0; i < n; i++) {
            s += a[Math.floor(Math.random() * a.length)];
        }
        return s;
    };

    module.exports = Logger;
});

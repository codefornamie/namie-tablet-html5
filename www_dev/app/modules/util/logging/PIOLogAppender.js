define(function(require, exports, module) {
    "use strict";

    var Class = require("modules/util/Class");
    var PIOLogLevel = require("modules/util/logging/PIOLogLevel");
    var log4javascript = require("log4javascript");

    /**
     * personium.ioのログAPIを利用してログ出力を行うためのAppenderクラスを作成する。
     * <p>
     * log4javascriptのLogAppenderとして利用することができる。<br>
     * ログイン前など、personium.ioにアクセスできない状態の場合は、ログを出力することはできない。<br>
     * また、personium.ioのログAPIはdebugレベルのログを出力することができないため、DEBUGログの出力が 指定された場合、何もしない。
     * </p>
     * <p>
     * クライアント毎にログ出力を識別するため、PIOLogAppender#setSessionIdメソッドを利用して、セッションIDを指定してから利用する。<br>
     * sessionIdは、personium.ioのログAPIの、objectパラメタの値に指定される。<br>
     * また、ログAPIのactionパラメタには、"namie-" + ${mode} と指定する。
     * </p>
     * @class personium.ioのログAPIを利用してログ出力を行うためのAppenderクラス
     * @exports PIOLogAppender
     * @constructor
     */
    var PIOLogAppender = function(app) {
        this.app = app;
        this.app.PIOLogLevel = PIOLogLevel;
        // PCS設定情報読み込み
        this.cell = app.config.basic.cellId;
        this.box = app.config.basic.boxName;
    };
    /**
     * このLogAppenderのプロトタイプ。<br>
     * デフォルトは、log4javascript.Appenderを使用する。
     * 
     * @memberOf PIOLogAppender#
     */
    PIOLogAppender.prototype = new log4javascript.Appender();
    /**
     * このLogAppenderのレイアウト。<br>
     * デフォルトは、log4javascript.SimpleLayoutを使用する。
     * 
     * @memberOf PIOLogAppender#
     */
    PIOLogAppender.prototype.layout = new log4javascript.SimpleLayout();
    /**
     * セッションIDを取得する。
     * 
     * @return {String} セッションID
     * @memberOf PIOLogAppender#
     */
    PIOLogAppender.prototype.getSessionId = function() {
        return this.sessionId;
    };
    /**
     * セッションIDを設定する。
     * 
     * @param {String} セッションID
     * @memberOf PIOLogAppender#
     */
    PIOLogAppender.prototype.setSessionId = function(sessionId) {
        this.sessionId = sessionId;
    };
    /**
     * ログAPIによるログ書き込みでエラーが発生した場合に呼び出されるコールバック関数。<br>
     * エラーを検出したい場合に、このパラメタにコールバック関数を指定する。<br>
     * 以下のシグネチャの関数を指定する。<br>
     * 
     * <pre><code>
     * function(tritium.LogEvent)
     * </code></pre>
     * @memberOf PIOLogAppender#
     */
    PIOLogAppender.prototype.onFailed = null;
    /**
     * ログAPIのactionパラメタに指定される値のプレフィックス
     * @memberOf PIOLogAppender#
     */
    PIOLogAppender.prototype.action = "namie-";
    /**
     * ログAPIを利用して、ログ出力を行う。
     * <p>
     * INFO,WARN,ERRORの場合、ログAPIを利用してログを出力する。 <br>
     * </p>
     * <p>
     * personium.io のログAPIは、debugレベルのログは出力できないため、DEBUGレベルのログ出力が指定された場合、何もしない。
     * </p>
     * <p>
     * ログイン前など、personium.ioにアクセスできない状態の場合はログ出力しない。
     * </p>
     * 
     * @param {log4javascript.LoggingEvent} loggingEvent log4javascriptのログイベントオブジェクト
     * @memberOf PIOLogAppender#
     */
    PIOLogAppender.prototype.append = function(loggingEvent) {
        if (!this.app.accessor) {
            // ログイン前など、personium.ioにアクセスできない状態の場合はログ出力しない
            return;
        }

        var formattedMessage = this.getLayout().format(loggingEvent);
        if (loggingEvent.getThrowableStrRep()) {
            formattedMessage += " " + loggingEvent.getThrowableStrRep();
        }
        // INFO,WARN,ERRORの場合、ログAPIを利用してログを出力する
        // personium.ioのログAPIはdebugレベルのログは出力できないため、何もしない
        // objectには、アプリ側で作成したセッションIDを指定する

        // actionには、アプリの種別を示すための文字列を指定する
        var action = this.action + this.app.config.basic.mode;

        var body = {
            "action" : action,
            "object" : this.getSessionId(),
            "result" : formattedMessage
        };
        if (log4javascript.Level.INFO.equals(loggingEvent.level)) {
            body.level = PIOLogLevel.INFO;
            this.app.box.event.post(body, this.getSessionId(), {
                error : this.onFailed
            });
        } else if (log4javascript.Level.WARN.equals(loggingEvent.level)) {
            body.level = PIOLogLevel.WARN;
            this.app.box.event.post(body, this.getSessionId(), {
                error : this.onFailed
            });
        } else if (loggingEvent.level.isGreaterOrEqual(log4javascript.Level.ERROR)) {
            body.level = PIOLogLevel.ERROR;
            this.app.box.event.post(body, this.getSessionId(), {
                error : this.onFailed
            });
        } else {
            if (!log4javascript.Level.DEBUG.equals(loggingEvent.level)) {
                console.log("Invalid loglevel specified. level=" + loggingEvent.level);
            }
        }
    };

    module.exports = PIOLogAppender;
});

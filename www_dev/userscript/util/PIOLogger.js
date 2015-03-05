/**
 * personium.ioへのログ出力を行う。
 * @param {Object} cell ログを出力するセルのオブジェクト
 */
function PIOLogger(cell) {
    this.dclog = cell.event;
}

/**
 * INFOレベルのログを出力する。
 * 
 * @param {Object} json ログ内容。以下のプロパティを指定する。<br>
 *                <ul>
 *                <li>action 処理行為</li>
 *                <li>target 処理対象</li>
 *                <li>message メッセージ</li>
 *                </ul>
 */
PIOLogger.prototype.info = function(json) {
    json.level = 'info';
    this.dclog.post(json);
};
/**
 * WARNレベルのログを出力する。
 * 
 * @param {Object} json ログ内容。以下のプロパティを指定する。<br>
 *                <ul>
 *                <li>action 処理行為</li>
 *                <li>target 処理対象</li>
 *                <li>message メッセージ</li>
 *                </ul>
 */
PIOLogger.prototype.warn = function(json) {
    json.level = 'warn';
    this.dclog.post(json);
};
/**
 * ERRORレベルのログを出力する。
 * 
 * @param {Object} json ログ内容。以下のプロパティを指定する。<br>
 *                <ul>
 *                <li>action 処理行為</li>
 *                <li>target 処理対象</li>
 *                <li>message メッセージ</li>
 *                </ul>
 */
PIOLogger.prototype.error = function(json) {
    json.level = 'error';
    this.dclog.post(json);
};

exports.PIOLogger = PIOLogger;

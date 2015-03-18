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

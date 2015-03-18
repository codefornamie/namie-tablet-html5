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
/* global StatusCode: false */
/* global CommonUtil: false */
/* global PIOUserScriptException: false */
/**
 * ユーザスクリプトの実行中、予期しないエラーが発生した場合の例外を作成する。
 * 
 * @param {String} scriptName ユーザースクリプト名
 * @param {Error} error 発生したエラー
 */
function PIOUnknownException(scriptName, error) {
    this.superclass.constructor.apply(this, [
            "Unknown error occured. userscript=%1 error=%2.", [
                    scriptName, error
            ]
    ]);
    this.statusCode = StatusCode.HTTP_INTERNAL_SERVER_ERROR;
}
exports.PIOUnknownException = CommonUtil.extend(PIOUserScriptException, PIOUnknownException);
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
/* global PIOUserScriptException: false */
/* global StatusCode: false */
/* global CommonUtil: false */
/**
 * 許可されていないリクエストメソッドでユーザスクリプトが呼び出された場合の例外を作成する。
 * 
 * @param {String} method クライアントから指定されたメソッド
 * @param {Array} allowdMethods ユーザスクリプトで許可されているメソッド
 */
function MethodNotAllowdException(method, allowdMethods) {
    this.superclass.constructor.apply(this, [
            "The request %1 Method not allowed. Allowed methods=%2.", [
                    method, allowdMethods
            ]
    ]);
    this.method = method;
    this.allowdMethods = allowdMethods;
    this.statusCode = StatusCode.HTTP_METHOD_NOT_ALLOWD;
}
exports.MethodNotAllowdException = CommonUtil.extend(PIOUserScriptException, MethodNotAllowdException);
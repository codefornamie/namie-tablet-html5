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
 * 更新権限を持っていないレコードを更新しようとした場合の例外を作成する。
 * 
 * @param {String} entity 更新対象のentity名
 * @param {String} id 更新対象のID
 */
function SecurityException(entity, id) {
    this.superclass.constructor.apply(this, [
            "The request is unauthenticated. entity=%1, id=%2.", [
                    entity, id
            ]
    ]);
    this.entity = entity;
    this.id = id;
    this.statusCode = StatusCode.HTTP_FORBIDDEN;
}
exports.SecurityException = CommonUtil.extend(PIOUserScriptException, SecurityException);
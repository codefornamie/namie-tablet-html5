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
/* global AbstractRegisterUserScript: false */
/* global CommonUtil: false */

/**
 * パーソナル情報のユーザスクリプトを作成する。
 * @class パーソナル情報のユーザスクリプト
 * @param {Object} request リクエスト情報を保持するオブジェクト
 */
function PersonalUserScript(request) {
    this.superclass.superclass.constructor.apply(this, [
            request, [
                    "POST", "PUT"
            ]
    ]);
    this.entity = "personal";
}
var PersonalUserScript = CommonUtil.extend(AbstractRegisterUserScript, PersonalUserScript);

exports.PersonalUserScript = PersonalUserScript;
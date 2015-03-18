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
 * 文字列操作を行うユーティリティを作成する。
 * 
 * @class 文字列操作を行うユーティリティクラス
 * @constructor
 */
function StringUtil() {

}

/**
 * 文字列の長さを取得する。
 * <p>
 * String#lengthが関数の場合、String#length()を利用して長さを取得する。それ以外の場合、String#lengthプロパティを利用して長さを取得する。
 * </p>
 * <p>
 * Rhinoだと、Stringのlengthがメソッドとなる。※ECMAScriptではlengthはプロパティ。<br/>
 * Stringの長さを取得する際はこのメソッドを利用して、差分を吸収する。<br />
 * </p>
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino/Scripting_Java#Java_Strings_and_JavaScript_Strings
 * @param {String} 文字列
 * @return {String} 文字列の長さ
 */
StringUtil.stringLength = function(s) {
    if (!s) {
        return 0;
    }
    var length;
    if (typeof s.length === 'function') {
        length = s.length();
    } else {
        length = s.length;
    }
    return length;
};
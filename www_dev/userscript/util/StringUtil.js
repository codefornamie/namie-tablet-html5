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
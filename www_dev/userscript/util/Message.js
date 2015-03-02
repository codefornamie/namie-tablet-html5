/**
 * personium.ioへのログ出力を行う。
 * @param {Object} cell ログを出力するセルのオブジェクト
 */
function Message() {
}

/**
 * メッセージを取得する。
 * 
 * @param {String} message メッセージ
 * @param {Object} params メッセージ内のパラメタ
 * @return {String} メッセージ
 */
Message.getMessage = function(message, params) {
    // パラメタの配列を、マップに変換する
    var paramMap = {};
    var key = 1;
    for ( var index in params) {
        paramMap[key++] = params[index];
    }
    // %1～%9 までのパラメタを変換するための正規表現
    var reg = /%([1-9])/g;
    var rep = function(whole, p1) {
        return paramMap[p1];
    };
    message = message.replace(reg, rep);
    return message;
};
exports.Message = Message;
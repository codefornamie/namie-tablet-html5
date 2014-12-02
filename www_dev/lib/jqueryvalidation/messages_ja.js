/*
 * Translated default messages for the jQuery validation plugin. Locale: JA
 * (Japanese; 日本語)
 */
setTimeout(function(){
jQuery.extend(jQuery.validator.messages, {
    required : "このフィールドは必須です。",
    remote : "このフィールドを修正してください。",
    email : "有効なEメールアドレスを入力してください。",
    url : "有効なURLを入力してください。",
    date : "有効な日付を入力してください。",
    dateISO : "有効な日付（ISO）を入力してください。",
    number : "有効な数字を入力してください。",
    digits : "数字のみを入力してください。",
    creditcard : "有効なクレジットカード番号を入力してください。",
    equalTo : "同じ値をもう一度入力してください。",
    accept : "有効な拡張子を含む値を入力してください。",
    maxlength : jQuery.validator.format("{0} 文字以内で入力してください。"),
    minlength : jQuery.validator.format("{0} 文字以上で入力してください。"),
    rangelength : jQuery.validator.format("{0} 文字から {1} 文字までの値を入力してください。"),
    range : jQuery.validator.format("{0} から {1} までの値を入力してください。"),
    max : jQuery.validator.format("{0} 以下の値を入力してください。"),
    min : jQuery.validator.format("{0} 以上の値を入力してください。")
});

// 全角ひらがな･カタカナのみ
jQuery.validator.addMethod("kana", function(value, element) {
    return this.optional(element) || /^([ァ-ヶーぁ-ん]+)$/.test(value);
}, "全角ひらがな･カタカナを入力してください。");

// 全角ひらがなのみ
jQuery.validator.addMethod("hiragana", function(value, element) {
    return this.optional(element) || /^([ぁ-ん]+)$/.test(value);
}, "全角ひらがなを入力してください。");

// 全角カタカナのみ
jQuery.validator.addMethod("katakana", function(value, element) {
    return this.optional(element) || /^([ァ-ヶー]+)$/.test(value);
}, "全角カタカナを入力してください。");

// 半角カタカナのみ
jQuery.validator.addMethod("hankana", function(value, element) {
    return this.optional(element) || /^([ｧ-ﾝﾞﾟ]+)$/.test(value);
}, "半角カタカナを入力してください。");

// 半角アルファベット（大文字･小文字）のみ
jQuery.validator.addMethod("alphabet", function(value, element) {
    return this.optional(element) || /^([a-zA-z¥s]+)$/.test(value);
}, "半角英字を入力してください。");

// 半角数字のみ
jQuery.validator.addMethod("intnum", function(value, element) {
    return this.optional(element) || /^([0-9]+)$/.test(value);
}, "半角数字を入力してください。");

// 半角アルファベット（大文字･小文字）もしくは数字のみ
jQuery.validator.addMethod("alphanum", function(value, element) {
    return this.optional(element) || /^([a-zA-Z0-9]+)$/.test(value);
}, "半角英数字を入力してください。");

// 郵便番号（例:012-3456）
jQuery.validator.addMethod("postnum", function(value, element) {
    // valueがスペースのみの入力かチェックする
    if(isSpace(value)) {
        return false;
    }
    return this.optional(element) || /^[0-9]{3}-[0-9]{4}$/.test(value);
}, "郵便番号を入力してください。（例:123-4567）");

// 携帯番号（例:010-2345-6789）
jQuery.validator.addMethod("mobilenum", function(value, element) {
    return this.optional(element) || /^0¥d0-¥d{4}-¥d{4}$/.test(value);
}, "携帯番号を入力してください。（例:010-2345-6789）");

// 電話番号（例:012-345-6789）
jQuery.validator.addMethod("telnum", function(value, element) {
    return this.optional(element) || /^[0-9-()]*$/.test(value);
}, "電話番号を入力してください。（例:012-345-6789）");

// FAX番号（例:012-345-6789）
jQuery.validator.addMethod("faxnum", function(value, element) {
    return this.optional(element) || /^[0-9-()]*$/.test(value);
}, "FAX番号を入力してください。（例:012-345-6789）");

// ログインID（英数）
jQuery.validator.addMethod("loginid", function(value, element) {
    return this.optional(element) || (/^[0-9a-z]+[0-9a-z_\-]*[0-9a-z]+$/.test(value) || /^[0-9a-z]$/.test(value))
            && !/[_\-][_\-]/.test(value);
}, "有効なログインIDを入力してください。（使用可能文字:「半角英数字」「-」,「_」,また記号は最初と最後、連続しての使用が不可です）");
// パスワード
jQuery.validator.addMethod("loginPassword", function(value, element) {
    return (this.optional(element) || /^([0-9a-zA-Z_\-]+)$/.test(value)) && (/^([\S]+)$/.test(value) || value.length === 0);
}, "有効なパスワードを入力してください。（使用可能文字:「半角英数字」「-」,「_」）");

// 時間（例:12:00）
jQuery.validator.addMethod("time", function(value, element) {
    // valueがスペースのみの入力かチェックする
    if(isSpace(value)) {
        return false;
    }
    if(/^([01][0-9]|2[0-3])([0-5][0-9])$/.test(value)){
        value = value.substring(0,value.length - 2) + ":" + value.substring(value.length - 2, value.length);
        element.value = value;
    }
    return this.optional(element) || /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(value);
}, "時間を入力してください。（例:12:00）");

// 少数点あり（例:12.3）
jQuery.validator.addMethod("dotnum", function(value, element) {
    // valueがスペースのみの入力かチェックする
    if(isSpace(value)) {
        return false;
    }
    return this.optional(element) || /^([1-9]\d*|0)(\.\d+)?$/.test(value);
}, "有効な数値を入力してください。");
/**
 * 和暦
 */
var JAPANESE_CALENDAR = [
    {
        label : "明治",
        value : "M",
        startYear : 1868,
        startMonth : 1,
        startDate : 1,
        maxYears : 45
    },
    {
        label : "大正",
        value : "T",
        startYear : 1912,
        startMonth : 7,
        startDate : 30,
        maxYears : 15
    },
    {
        label : "昭和",
        value : "S",
        startYear : 1926,
        startMonth : 12,
        startDate : 25,
        maxYears : 64
    },
    {
        label : "平成",
        value : "H",
        startYear : 1989,
        startMonth : 1,
        startDate : 8
    }
];

/**
 * 今日の日付を返す。時刻部分は0:00:00に初期化する。
 */
var today = function() {
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
};
/**
 * 文字列をDate型にパースする サポートするフォーマットは以下。Gは和暦の元号をあらわす１文字のアルファベット(M/T/S/H)である。
 * G.YY.MM.DD GYY.MM.DD YYYY.MM.DD YYYYMMDD なお、上記ドットは、スラッシュとハイフンでも可能である。
 *
 * @memberOf hmc.util.Utils
 * @param {String}
 *            日付を表す文字列。
 * @return {Date} パース後のDate。変換できない場合はnull
 */
var parseDate = function(str) {
    // トリムする
    str = str.replace(/(^\s+)|(\s+$)/g, "");
    // 大文字変換する
    str = str.toUpperCase();
    // 後半が数字のみなら、区切る( 99991231 -> 9999-12-31 )
    str = str.replace(/([0-9]+)([0-9]{2})([0-9]{2})$/, "$1-$2-$3");
    // 先頭が英字なら区切る
    str = str.replace(/^([A-Z])[.-\/]?/, "$1-");
    // 区切り文字(ハイフン、スラッシュ、ドットをハイフンに統一する
    str = str.replace(/[.-\/]/g, "-");

    // strはここまでで、以下の何れかの形式になる。
    // 1234-56-78
    // S-12-34-56

    seps = str.split("-");
    // 3つか4つのトークンに分かれない場合はエラー
    if (seps.length < 3 || seps.length > 4) {
        return null;
    }
    // 英字で始まる（和暦）か？
    var gengo = null;
    if (seps[0].replace(/[A-Z]/, "").length == 0) {
        gengo = seps[0];
        seps.shift();
    }
    var year = Number(seps.shift());
    var month = Number(seps.shift());
    var date = Number(seps.shift());
    // 和暦の場合の年の計算
    if (gengo) {
        var gengoIndex;
        for (gengoIndex = 0; gengoIndex < JAPANESE_CALENDAR.length; gengoIndex++) {
            if (gengo == JAPANESE_CALENDAR[gengoIndex].value) {
                break;
            }
        }
        if (gengoIndex >= JAPANESE_CALENDAR.length) {
            // 元号が見つからない場合
            return null;
        }
        // 元号の開始日と終了日の範囲を超えている場合は誤りとして扱う。
        var md = month * 100 + date;
        var cgengo = JAPANESE_CALENDAR[gengoIndex];
        var ngengo = JAPANESE_CALENDAR[gengoIndex + 1];
        if (year == 0
                || year == 1
                && md < cgengo.startMonth * 100 + cgengo.startDate
                || (ngengo && (year > cgengo.maxYears || year == cgengo.maxYears
                        && md >= ngengo.startMonth * 100 + ngengo.startDate))) {
            return null;
        }
        year = JAPANESE_CALENDAR[gengoIndex].startYear + year - 1;
    }
    // 日付型へ変換する。フォーマットエラーの場合または、dateがその月の最大を超えた場合はnull
    var res = new Date(year + "/" + month + "/" + date);
    if (isNaN(res.getYear()) || res.getDate() != date) {
        res = null;
    }
    return res;
};

/**
 * 引数(value)が空白のみかチェックする
 * @param {String} value チェックする文字列
 * @return {boolean} true:空白のみ false:空白だけではない
 */
var isSpace = function(value) {
    if (value.length > 0 && $.trim(value).length === 0) {
        return true;
    }
    return false;
};

jQuery.validator.addMethod("wareki", function(value, element) {
    if (this.optional(element)) {
        return true;
    }
    var date = parseDate(value);
    return date != null;
}, "有効な日付を入力してください。");

jQuery.validator.addMethod("date", function(value, element) {
    // valueがスペースのみの入力かチェックする
    if(isSpace(value)) {
        return false;
    }
    if (this.optional(element)) {
        return true;
    }
    var date = parseDate(value);
    return date != null;
}, "有効な日付を入力してください。");

jQuery.validator.addMethod("dateNoFuture", function(value, element) {
    if (this.optional(element)) {
        return true;
    }
    var date = parseDate(value);
    return (date && date.getTime() <= today().getTime());
}, "未来の日付は入力できません。");

jQuery.validator.addMethod("dateNoPast", function(value, element) {
    if (this.optional(element)) {
        return true;
    }
    var date = parseDate(value);
    return (date && date.getTime() >= today().getTime());
}, "過去の日付は入力できません。");

jQuery.validator.addMethod("dateNoToday", function(value, element) {
    if (this.optional(element)) {
        return true;
    }
    var date = parseDate(value);
    return (date && date.getTime() != today().getTime());
}, "今日の日付は入力できません。");
}, 500);
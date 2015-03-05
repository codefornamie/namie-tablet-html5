define(function(require, exports, module) {
    "use strict";

    /**
     * 定数クラス
     * @class 定数クラス
     * @constructor
     */
    var Code = function() {

    };

    // アプリ動作モード
    Code.APP_MODE_NEWS = "news";
    Code.APP_MODE_LETTER = "letter";
    Code.APP_MODE_POSTING = "posting";
    Code.APP_MODE_OPE = "ope";
    Code.APP_MODE_DOJO = "dojo";
    Code.APP_MODE_RAD = "rad";

    // アプリモードとアプリ名とのマッピング
    Code.APP_NAME = {
        "news" : "なみえ新聞",
        "letter" : "なみえ写真投稿",
        "posting" : "なみえ新聞ライター",
        "ope" : "浪江町アプリ管理ツール",
        "dojo" : "なみえ道場"
    };
    /**
     * ゲストとしてログイン時のID
     */
    Code.GUEST_LOGIN_ID = "guest";
    /**
     * ゲストとしてログイン時のpassword
     */
    Code.GUEST_LOGIN_PASSWORD = "guest";
    // 記事カテゴリ
    Code.ARTICLE_CATEGORY_LIST = [
            {
                key : "1",
                value : "RSS"
            }, {
                key : "2",
                value : "YouTube"
            }, {
                key : "3",
                value : "イベント",
                valueByMode : {
                    "ope" : "イベント(町民代理投稿)",
                }
            }, {
                key : "4",
                value : "レポート",
                valueByMode : {
                    "ope" : "レポート(町民代理投稿)",
                }
            }, {
                key : "5",
                value : "記事"
            }, {
                key : "6",
                value : "写真投稿"
            }, {
                key : "7",
                value : "Facebook"
            }, {
                key : "8",
                value : "おくやみ"
            }, {
                key : "9",
                value : "イベント",
                valueByMode : {
                    "ope" : "イベント(役場)",
                }
            }, {
                key : "10",
                value : "レポート",
                valueByMode : {
                    "ope" : "レポート(役場)",
                }
            }
    ];

    // 各アプリで使用する記事カテゴリ
    Code.ARTICLE_CATEGORY_LIST_BY_MODE = {};
    Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_POSTING] = [
            "3", "4"
    ];
    Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_OPE] = [
            "5", "9", "10", "6", "3", "4"
    ];
    Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_LETTER] = [
        "6"
    ];

    // 記事ステータス
    Code.ARTICLE_STATUS_PUBLISHED = "掲載中";
    Code.ARTICLE_STATUS_BEFORE_PUBLISH = "未掲載";
    Code.ARTICLE_STATUS_DEPUBLISHED = "配信停止中";

    /**
     * img要素のscr属性にpersonium.ioのWebDAVが格納されているサイトの情報定義
     */
    Code.MINPO_SCRAPING = [
            {
                site : "福島民報(トップニュース)",
                scraping : "minpo"
            }, {
                site : "福島民報(県内ニュース)",
                scraping : "minpo"
            }, {
                site : "福島民報(スポーツニュース)",
                scraping : "minpo"
            }
    ];
    // 記事サイト
    Code.ARTICLE_SITE_LIST = [
            {
                key : "福島テレビ",
                value : "localnews"
            }, {
                key : "福島民報",
                value : "localnews"
            }, {
                key : "浪江町役場新着情報",
                value : "townoffice"
            }, {
                key : "イベント",
                value : "event"
            }, {
                key : "レポート",
                value : "event"
            }, {
                key : "浪江町復興支援員宮城県駐在ブログ",
                value : "blog"
            }, {
                key : "写真投稿",
                value : "letter"
            }, {
                key : "つながろうなみえ",
                value : "blog"
            }
    ];
    Code.ARTICLE_SITE_NONE = "other";

    // ArticleModelの画像タイプ
    Code.IMAGE_TYPE_PIO = 2;
    Code.IMAGE_TYPE_URL = 1;
    Code.IMAGE_TYPE_NONE = 0;

    // 許される連続した休刊日の最大(日)
    Code.LIMIT_CONSECUTIVE_HOLIDAY = 20;

    // 写真投稿アプリ: 投稿した記事の掲載期間(日数)
    Code.LETTER_PUB_PERIOD = 7;

    // 写真投稿アプリ: 一日の投稿記事の上限数
    Code.LETTER_PUBLISH_LIMIT = 3;

    // 道場動画カテゴリ
    // TODO 仮並び順
    Code.DOJO_CATEGORY_LIST = [
            {
                key : "基礎編",
                value : 1
            }, {
                key : "タブレットの機能を使おう編",
                value : 2
            }, {
                key : "もっと使おう編",
                value : 3
            }
    ];
    // 道場動画ステータス
    Code.DOJO_STATUS_SOLVED = "solved";
    Code.DOJO_STATUS_UNSOLVED = "unsolved";
    Code.DOJO_STATUS_WATCHED = "watched";
    Code.DOJO_STATUS_UNWATCHED = "unwatched";

    /**
     * 道場の級情報
     */
    Code.DOJO_LEVELS = [
            {
                id : "0",
                className : "none",
                levelName : "",
                label : "白帯",
                description : "このコースでは、なみえタブレットとは何か、なみえタブレットでできること、使用上の注意、 箱から出して電源を入れるまで、タブレットの画面の見方、なみえ新聞の見方を学べるよ。",
                congratulations : "白帯コースの動画を全て閲覧しました。これでタブレットの基礎動作はマスターできましたね。<br>「茶帯」を進呈します！",
                iconPath : ""
            },
            {
                id : "1",
                className : "white",
                levelName : "白帯",
                label : "茶帯",
                description : "このコースでは、写真の撮影・閲覧、文字入力の方法、浪江町のホームページの見方、Googleマップの見方、YouTubeの見方、インターネット（Google検索、Yahoo）の使い方を学べるよ。",
                congratulations : "茶帯コースの動画を全て閲覧しました。これでタブレットの応用動作はマスターできましたね。<br>「茶帯」を進呈します！",
                iconPath : ""
            }, {
                id : "2",
                className : "brown",
                levelName : "茶帯",
                label : "黒帯",
                description : "このコースでは、なみえ新聞に投稿する方法、LINEの使い方、その他アプリ（手書きメモ、スケジュール、ネットラジオ、連絡帳）の使い方を学べるよ。",
                congratulations : "黒帯コースの動画を全て閲覧しました。これでタブレットの全てをマスターできましたね。<br>「黒帯」を進呈します！",
                iconPath : ""
            }, {
                id : "3",
                className : "black",
                levelName : "黒帯",
                label : "",
                description : "",
                congratulations : "",
                iconPath : ""
            }
    ];

    // 道場のイントロダクション動画のID
    Code.DOJO_INTORODUCTION_VIDEO_ID = "NgVzppfZ-4Q";

    // 放射線データ保存時の「線量」保存時倍率
    Code.RAD_RADIATION_DOSE_MAGNIFICATION = 1000;
    // 放射線データ保存時の「緯度経度」保存時倍率
    Code.RAD_LAT_LONG_MAGNIFICATION = 1000000;
    // 放射線データ保存時の「高度」保存時倍率
    Code.RAD_ALTITUDE_MAGNIFICATION = 1000;

    // 測定種別：個人測定
    Code.RAD_MEASUREMENT_PRIVATE = "private";
    // 測定種別：車載線量計
    Code.RAD_MEASUREMENT_MUNICIPALITY = "municipality";

    // 放射線アプリの使い方動画のID
    // TODO: 正式版に差し替える
    Code.RAD_TUTORIAL_VIDEO_ID = "NgVzppfZ-4Q";

    /**
     * HORIBAcsvの収集時刻ヘッダ名
     */
    Code.HORIBA_TITLE_DATE = "Date/Time";
    /**
     * HORIBAcsvの線量ヘッダ名
     */
    Code.HORIBA_TITLE_DOSE = "Dose equivalent rate (uSv/h)";
    /**
     * HORIBAcsvの緯度経度ヘッダ名
     */
    Code.HORIBA_TITLE_POSITION = "Position";
    /**
     * HORIBAcsvの高度ヘッダ名
     */
    Code.HORIBA_TITLE_ALTITUDE = "Altitude(m)";

    /**
     * 車載csvの時刻ヘッダ名
     */
    Code.AUTOMOTIVE_TITLE_TIME = "時刻";
    /**
     * 車載csvの線量ヘッダ名
     */
    Code.AUTOMOTIVE_TITLE_DOSE1 = "線量１";
    Code.AUTOMOTIVE_TITLE_DOSE2 = "線量２";
    Code.AUTOMOTIVE_TITLE_DOSE3 = "線量３";
    /**
     * 車載csvの緯度ヘッダ名
     */
    Code.AUTOMOTIVE_TITLE_LATITUDE = "緯度";
    /**
     * 車載csvの経度ヘッダ名
     */
    Code.AUTOMOTIVE_TITLE_LONGITUDE = "経度";

    /**
     *  放射線データのエラーコード
     */
    // 緯度経度が抜けているレコードがある
    Code.ERR_DOSE_MISSING = 1 << 0;

    // 線量が抜けているレコードがある
    Code.ERR_POSITION_MISSING = 1 << 1;

    // ファイル形式が間違っている
    Code.ERR_INVALID_FILETYPE = 1 << 2;

    // 日付が不正である
    Code.ERR_INVALID_DATE = 1 << 3;

    // レコードが無い
    Code.ERR_NO_RECORD = 1 << 4;

    /**
     * アプリモード毎に、キャッシュを有効にするかどうか定義する。
     */
    Code.CACHE_MODE = {
        "news" : true,
        "ope" : false,
        "letter" : false,
        "posting" : false,
        "dojo" : false
    };

    /**
     * ウィジェット画像を定義する。
     * ウィジェット表示候補の画像が増えたらここに定義する
     */
    Code.WIDGET_CHARACTER = [
                             ["ukedon_1_b_1.png", "ukedon_1_b_2.png"],
                             ["ukedon_1_c_1.png", "ukedon_1_c_2.png"],
                             ["ukedon_1_n_1.png", "ukedon_1_n_2.png"],
                             ["ukedon_1_p_1.png", "ukedon_1_p_2.png"],
                             ["ukedon_2_b_1.png", "ukedon_2_b_2.png"],
                             ["ukedon_2_c_1.png", "ukedon_2_c_2.png"],
                             ["ukedon_2_n_1.png", "ukedon_2_n_2.png"],
                             ["ukedon_2_p_1.png", "ukedon_2_p_2.png"],
                             ["ukedon_3_b_1.png", "ukedon_3_b_2.png"],
                             ["ukedon_3_c_1.png", "ukedon_3_c_2.png"],
                             ["ukedon_3_n_1.png", "ukedon_3_n_2.png"],
                             ["ukedon_3_p_1.png", "ukedon_3_p_2.png"],
                             ["ukedon_4_c_1.png", "ukedon_4_c_2.png"],
                             ["ukedon_4_k_1.png", "ukedon_4_k_2.png"],
                             ["ukedon_4_w_1.png", "ukedon_4_w_2.png"],
                             ["ukedon_5_b_1.png", "ukedon_5_b_2.png"],
                             ["ukedon_5_c_1.png", "ukedon_5_c_2.png"],
                             ["ukedon_5_n_1.png", "ukedon_5_n_2.png"],
                             ["ukedon_5_p_1.png", "ukedon_5_p_2.png"],
                             ["ukedon_6_b_1.png", "ukedon_6_b_2.png"],
                             ["ukedon_6_c_1.png", "ukedon_6_c_2.png"],
                             ["ukedon_6_n_1.png", "ukedon_6_n_2.png"],
                             ["ukedon_6_p_1.png", "ukedon_6_p_2.png"],
                             ["ukedon_7_b_1.png", "ukedon_7_b_2.png"],
                             ["ukedon_7_c_1.png", "ukedon_7_c_2.png"],
                             ["ukedon_7_p_1.png", "ukedon_7_p_2.png"]
                            ];

    module.exports = Code;
});

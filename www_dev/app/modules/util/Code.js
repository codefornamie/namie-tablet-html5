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
                value : "イベント"
            }, {
                key : "4",
                value : "レポート"
            }, {
                key : "5",
                value : "記事"
            }, {
                key : "6",
                value : "写真投稿"
            }, {
                key : "7",
                value : "Facebook"
            }
    ];

    // 各アプリで使用する記事カテゴリ
    Code.ARTICLE_CATEGORY_LIST_BY_MODE = {};
    Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_POSTING] = [
            "3", "4"
    ];
    Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_OPE] = [
            "3", "4", "5", "6"
    ];
    Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_LETTER] = [
            "6"
    ];

    // 記事ステータス
    Code.ARTICLE_STATUS_PUBLISHED = "掲載中";
    Code.ARTICLE_STATUS_BEFORE_PUBLISH = "未掲載";
    Code.ARTICLE_STATUS_DEPUBLISHED = "配信停止中";

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
    
    // 写真投稿アプリ: 投稿した記事の掲載期間(日数)
    Code.LETTER_PUB_PERIOD = 7;

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
    Code.DOJO_LEVELS = [{
        id: "0",
        className: "none",
        levelName: "",
        label: "白帯編",
        description: "初めてタブレットをさわる方のためのコースです。（文言未決定）",
        iconPath: ""
    },{
        id: "1",
        className: "white",
        levelName: "白帯",
        label: "茶帯編",
        description: "茶帯コースです。（文言未決定）",
        iconPath: ""
    },{
        id: "2",
        className: "brown",
        levelName: "茶帯",
        label: "黒帯編",
        description: "黒帯コースです。（文言未決定）",
        iconPath: ""
    },{
        id: "3",
        className: "black",
        levelName: "黒帯",
        label: "",
        description: "",
        iconPath: ""
    }];

    module.exports = Code;
});

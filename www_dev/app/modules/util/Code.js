define(function(require, exports, module) {
    "use strict";

    var Code = function() {

    };

    // アプリ動作モード
    Code.APP_MODE_NEWS = "news";
    Code.APP_MODE_POSTING = "posting";
    Code.APP_MODE_OPE = "ope";

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
            },
    ];

    // 各アプリで使用する記事カテゴリ
    Code.ARTICLE_CATEGORY_LIST_BY_MODE = {};
    Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_POSTING] = [
            "3", "4"
    ];
    Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_OPE] = [
            "3", "4", "5"
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
                key : "浪江町復興支援員宮城県駐在ブログ",
                value : "blog"
            }
    ];
    Code.ARTICLE_SITE_NONE = "article";

    // ArticleModelの画像タイプ
    Code.IMAGE_TYPE_PIO = 2;
    Code.IMAGE_TYPE_URL = 1;
    Code.IMAGE_TYPE_NONE = 0;

    module.exports = Code;
});

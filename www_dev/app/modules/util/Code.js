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


    module.exports = Code;
});

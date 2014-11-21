define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListView = require("modules/view/news/FeedListView");
    var jquerySortable = require("jquery-sortable");

    /**
     * 運用管理ツールの記事一覧テーブルのViewクラスを作成する。
     * @class 運用管理ツールの記事一覧テーブルのView
     * @exports OpeFeedListView
     * @constructor
     */
    var OpeFeedListView = FeedListView.extend({
        afterRendered : function() {
            // ドラッグアンドドロップによるテーブルの並び替えを行うための設定
            this.$('.sortable').sortable({
                items : 'tr',
                forcePlaceholderSize : true,
                handle : '.handle'
            });
        }
    });

    module.exports = OpeFeedListView;
});

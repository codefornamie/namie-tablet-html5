define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListItemView = require("modules/view/news/FeedListItemView");
    var TagListView = require("modules/view/news/TagListView");

    /**
     * 運用管理ツールの記事一覧テーブルの記事レコードのViewを作成する。
     * 
     * @class 運用管理ツールの記事一覧テーブルの記事レコードのView
     * @exports OpeFeedListItemView
     * @constructor
     */
    var OpeFeedListItemView = FeedListItemView.extend({
        /**
         * このViewの親要素
         */
        tagName : "tr",
        /**
         * このViewを表示する際に利用するアニメーション
         */
        animation : null,
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            // タグリストの追加
            this.tagListView = new TagListView();
            this.tagListView.tagsArray = this.model.get("tagsArray");
            this.setView(".articleTags", this.tagListView);
            this.tagListView.render();
        }
    });

    module.exports = OpeFeedListItemView;
});

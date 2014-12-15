define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var TabletArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports LetterListItemView
     * @constructor
     */
    var LetterListItemView = TabletArticleListItemView.extend({
        template : require("ldsh!templates/{mode}/letter/top/letterListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberof LetterListItemView#
         */
        afterRendered : function() {
        },

        /**
         * aタグがクリックされたら呼ばれる
         * @override
         * @memberof LetterListItemView#
         */
        onClickAnchorTag: function (e) {
            e.preventDefault();
        }
    });
    module.exports = LetterListItemView;
});
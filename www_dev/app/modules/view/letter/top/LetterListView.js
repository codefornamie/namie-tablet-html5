define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var TabletArticleListView = require("modules/view/news/ArticleListView");
    var LetterListItemView = require("modules/view/letter/top/LetterListItemView");

    /**
     * 記事一覧のViewクラス
     * 
     * @class 記事一覧のViewクラス
     * @exports LetterListView
     * @constructor
     */
    var LetterListView = TabletArticleListView.extend({
        /**
         * テンプレート
         * @memberof LetterListView#
         */
        template : require("ldsh!templates/{mode}/top/letterList"),

        /**
         * Layoutがレンダリングされた後に呼ばれる
         * @memberof LetterListView#
         */
        afterRendered : function() {
            if (this.collection.size() === 0) {
                $(this.el).find(LetterListView.SELECTOR_LETTER_LIST).text("記事情報がありません");
            }
        },

        /**
         * 取得した記事一覧を描画する
         * @override
         * @memberof LetterListView#
         */
        setArticleList : function() {
            this.setLetterListItemViews();
        },

        /**
         * 取得した記事一覧を元にLetterListItemViewをセットする
         * @memberof LetterListView#
         */
        setLetterListItemViews : function() {
            this.collection.each(function(model) {
                this.insertView(LetterListView.SELECTOR_LETTER_LIST, new LetterListItemView({
                    model : model,
                    template : require("ldsh!templates/{mode}/top/letterListItem")
                }));
            }.bind(this));
        }
    }, {
        /**
         * リストのセレクタ
         */
        SELECTOR_LETTER_LIST : "#letter-list"
    });

    module.exports = LetterListView;
});
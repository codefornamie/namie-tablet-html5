define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DateUtil = require("modules/util/DateUtil");

    /**
     * 記事詳細画面のViewクラス
     * 
     * @class 記事詳細画面のViewクラス
     * @exports ArticleDetailView
     * @constructor
     */
    var ArticleDetailView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/news/articleDetail"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
        },

        /**
         *  Viewを初期化する
         */
        initialize : function() {
            console.assert(this.model, 'model is not defined');

            console.log('[ArticleDetailView]', this.model);
        },

        events : {
            'click [data-goto-edit]': 'onClickGotoEdit',
            'click [data-goto-delete]': 'onClickGotoDelete'
        },

        /**
         *  編集ボタンをクリックしたら呼ばれる
         */
        onClickGotoEdit: function () {
            app.router.articleRegist({
                model: this.model
            });
        },

        /**
         *  削除ボタンをクリックしたら呼ばれる
         */
        onClickGotoDelete: function () {
        }
    });
    module.exports = ArticleDetailView;
});

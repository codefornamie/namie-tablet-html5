define(function(require, exports, module) {

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var OpeSlideshowRegistConfirmView = require("modules/view/ope/slideshow/OpeSlideshowRegistConfirmView");

    /**
     * スライドショー新規登録・編集画面のViewクラス
     * 
     * @class スライドショー新規登録・編集画面のViewクラス
     * @exports OpeSlidoshowRegistView
     * @constructor
     */
    var OpeSlidoshowRegistView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/slideshow/slideshowRegist"),
        events : {
            "click #slideshowCancelButton" : "onClickSlideshowCancelButton",
            "click #slideshowConfirmButton" : "onClickSlideshowConfirmButton"
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlidoshowRegistView#
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlidoshowRegistView#
         */
        afterRendered : function() {
            this.setData();
        },

        /**
         * 編集時にデータを各フォームにセットする
         * @memberOf OpeSlidoshowRegistView#
         */
        setData: function () {
            this.insertView("#slideshowFileArea", new ArticleRegistFileItemView()).render();
            this.hideLoading();
        },
        /**
         * 確認画面押下時のコールバック関数
         * @memberOf OpeSlidoshowRegistView#
         */
        onClickSlideshowConfirmButton : function() {
            // TODO Validate Check
            this.onSubmit();
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         * @memberOf OpeSlidoshowRegistView#
         */
        onClickSlideshowCancelButton : function() {
            if (this.backFunction) {
                this.backFunction();
            } else {
                app.router.back();
            }
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         * @memberOf OpeSlidoshowRegistView#
         */
        onSubmit : function() {
            // TODO 未実装
            // 登録処理を開始する
//            this.setInputValue();
            $("#slideshowRegistPage").hide();
            this.setView("#slideshowRegistConfirmWrapperPage", new OpeSlideshowRegistConfirmView({
                model : this.model,
                thumbImageByteArray : this.thumbImageByteArray
            })).render();
            $("#snap-content").scrollTop(0);
        }

    });
    module.exports = OpeSlidoshowRegistView;
});

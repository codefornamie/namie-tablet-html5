define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var AbstractView = require("modules/view/AbstractView");
    var OpeSlideshowListItemView = require("modules/view/ope/slideshow/OpeSlideshowListItemView");
    var SlideshowCollection = require("modules/collection/slideshow/SlideshowCollection");
    var vexDialog = require("vexDialog");


    /**
     * スライドショー一覧画面のViewクラス
     * 
     * @class スライドショー一覧画面のViewクラス
     * @exports OpeSlideshowListView
     * @constructor
     */
    var OpeSlideshowListView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/slideshow/slideshowList"),
        slideshowCollection : new SlideshowCollection(),
        events : {
            "click [data-slideshow-register-button]" : "onClickSlideshowRegisterButton"
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlideshowListView#
         */
        beforeRendered : function() {
            this.slideshowCollection.each(function (model) {
                this.insertView("#slideshowListfileArea", new OpeSlideshowListItemView({
                    model : model
                }));
            }.bind(this));
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlideshowListView#
         */
        afterRendered : function() {
            this.hideLoading();
        },

        /**
         * 初期化処理
         * @memberOf OpeSlideshowListView#
         */
        initialize : function() {
            this.loadSlideshow();
            this.listenTo(this.slideshowCollection, "reset sync request destroy", this.render);
        },

        /**
         * slideshowを読み込む
         * @param {Function} callback
         * @memberOf OpeSlideshowListView#
         */
        loadSlideshow : function() {
            this.slideshowCollection.fetch({
                success : function(model, resp, options) {
                    this.showSuccessMessage("スライドショー画像情報の検索", model);
                }.bind(this),

                error : function onErrorLoadSlideshow(model, resp, options) {
                    this.showErrorMessage("スライドショー画像情報の検索", resp);
                }.bind(this)
            });
        },
        /**
         *  新規スライドショー画像登録ボタン押下時に呼び出される
         *  @memberOf OpeSlideshowListView#
         */
        onClickSlideshowRegisterButton: function () {
            if (this.slideshowCollection && this.slideshowCollection.size() >= 100) {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("スライドショーが100件以上登録されているため、新規登録ができません。");
                return;
            }
            $("[data-sequence-register-button]").hide();
            $("#sequenceConfirm").hide();
            app.router.opeSlideshowRegist();
        }
    });
    module.exports = OpeSlideshowListView;
});

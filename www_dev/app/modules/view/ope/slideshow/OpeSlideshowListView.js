define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var AbstractView = require("modules/view/AbstractView");
    var OpeSlideshowListItemView = require("modules/view/ope/slideshow/OpeSlideshowListItemView");
    var SlideshowCollection = require("modules/collection/slideshow/SlideshowCollection");

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
        },

        /**
         * 初期化処理
         * @memberOf OpeSlideshowListView#
         */
        initialize : function() {
            this.listenTo(this.slideshowCollection, "reset sync request", this.render);
        },

        /**
         * slideshowを読み込む
         * @param {Function} callback
         * @memberOf OpeSlideshowListView#
         */
        loadSlideshow : function() {
            this.slideshowCollection.fetch({

                success : function() {
                    app.logger.debug("Search successful");
                },

                error : function onErrorLoadSlideshow() {
                    app.logger.debug("Faild to search PIO");
                }
            });
        },
        /**
         *  新規スライドショー画像登録ボタン押下時に呼び出される
         *  @memberOf OpeSlideshowListView#
         */
        onClickSlideshowRegisterButton: function () {
            $("[data-sequence-register-button]").hide();
            $("#sequenceConfirm").hide();
            app.router.opeSlideshowRegist();
        },
    });
    module.exports = OpeSlideshowListView;
});

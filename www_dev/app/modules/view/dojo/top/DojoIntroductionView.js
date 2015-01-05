define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     *  道場アプリの初回説明画面を表示するためのViewクラスを作成する。
     *
     *  @class 道場アプリの初回説明画面を表示するためのView
     *  @exports DojoIntroductionView
     *  @constructor
     */
    var DojoIntroductionView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/top/dojoIntroduction"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
            var $fadeIn = this.$el.find('[data-fade-in]');

            // ダイアログをフェードインさせる
            setTimeout(function () {
                $fadeIn.addClass('is-ready');
            }, 0);
        },

        /**
         *  初期化処理
         */
        initialize : function() {
        },

        events : {
            'click [data-dojo-introduction-closer]': 'onClickIntroductionCloser'
        },

        /**
         *  初回説明画面を閉じる。閉じるボタンが押されたら呼ばれる
         *
         *  @param {Event} ev
         */
        onClickIntroductionCloser: function (ev) {
            var self = this;

            ev.preventDefault();

            // ダイアログをフェードアウトさせる
            this.$el.fadeOut(function () {
                self.remove();
            });

            app.router.back();
        }
    });

    module.exports = DojoIntroductionView;
});

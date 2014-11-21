define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     *  設定画面のView
     *
     *  @class
     *  @exports SettingsView
     *  @constructor
     */
    var SettingsView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/common/settings"),

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
            'click [data-settings-closer]': 'onClickSettingsCloser'
        },

        /**
         *  設定画面を閉じる。✕ボタンや閉じるボタンが押されたら呼ばれる
         *
         *  @param {Event} ev
         */
        onClickSettingsCloser: function (ev) {
            ev.preventDefault();

            app.router.back();
        }
    });

    module.exports = SettingsView;
});

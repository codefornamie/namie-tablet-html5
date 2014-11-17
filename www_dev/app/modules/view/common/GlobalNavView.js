/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var Snap = require("snap");

    var GlobalNavView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/common/global-nav"),

        beforeRendered : function() {
        },

        afterRendered : function() {
            this.updateBackHomeButton();
        },

        initialize : function() {
            this.snapper = new Snap({
                element: $('#snap-content')[0],
                tapToClose: true,
                touchToDrag: false
            });
            $('#snap-content').data("snap",this.snapper);
        },

        /**
         * RadiationエンティティセットへのFetch成功時のイベントハンドラ。
         */
        onFetchRadiation: function() {
            var model = this.collection.at(0);
            var value = "-";
            if (model) {
                value = model.get("value");
            }
            $("#radiationValue").text(value + "μSv/h");
        },

        events : {
            'click [data-drawer-opener]': 'onClickDrawerOpener',
            'click [data-back-home]': 'onClickBackHome',
            'change #selectRadiation' : "onChangeRadiationStation",
            'click [data-font-size]': 'onClickFontSize'
        },
        
        /**
         *  今日の新聞に戻るボタンは
         *  topでは表示しない
         */
        updateBackHomeButton: function () {
            if (Backbone.history.fragment == 'top') {
                $('[data-back-home]').hide();
            } else {
                $('[data-back-home]').show();
            }
        },

        /**
         *  サンドイッチボタンがクリックされたら呼ばれる
         *  @param {Event} ev
         */
        onClickDrawerOpener: function (ev) {
            ev.preventDefault();
            this.snapper.open('left');
        },

        /**
         *  今日の新聞に戻るボタンが押されたら呼ばれる
         */
        onClickBackHome: function (ev) {
            ev.preventDefault();
            app.router.back();
        },
        
        /**
         *  フォントサイズ変更ボタンが押されたら呼ばれる
         */
        onClickFontSize: function (ev) {
            app.trigger('willChangeFontSize');
            
            var $target = $(ev.currentTarget);
            var size = parseInt($target.attr('data-font-size'), 10);
            
            $('html, body').css('font-size', size + 'px');

            app.trigger('didChangeFontSize');
        }
    });

    module.exports = GlobalNavView;
});

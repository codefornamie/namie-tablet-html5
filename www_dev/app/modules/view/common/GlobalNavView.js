/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var Snap = require("snap");

    var GlobalNavView = AbstractView.extend({
        template : require("ldsh!/app/templates/common/global-nav"),

        beforeRendered : function() {
        },

        afterRendered : function() {
            this.updateBackHomeButton();
        },

        initialize : function() {
            var snapper = this.snapper = new Snap({
                element: document.getElementById('snap-content'),
                tapToClose: true,
                touchToDrag: false
            });

            app.router.on('route', function () {
                snapper.close();
            });
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
         */
        onClickDrawerOpener: function () {
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

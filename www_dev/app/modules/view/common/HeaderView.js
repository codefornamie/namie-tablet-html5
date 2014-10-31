define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var Snap = require("snap");

    var HeaderView = AbstractView.extend({
        template : require("ldsh!/app/templates/common/header"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {
            this.snapper = new Snap({
                element: document.getElementById('snap-content'),
                tapToClose: true,
                touchToDrag: false
            });
        },

        events : {
            'click [data-drawer-opener]': 'onClickDrawerOpener'
        },
        
        /**
         *  サンドイッチボタンがクリックされたら呼ばれる
         */
        onClickDrawerOpener: function () {
            this.snapper.open('left');
        }
    });

    module.exports = HeaderView;
});

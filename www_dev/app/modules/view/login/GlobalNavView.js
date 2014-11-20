define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var GlobalNavView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/login/global-nav"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },
        
        events: {
            'click [data-prev-day]': 'goToPrevDay',
            'click [data-next-day]': 'goToNextDay'
        },

        initialize : function() {

        },
        
        /**
         *  前の日ボタンをクリックしたら呼ばれる
         */
        goToPrevDay: function () {
        },
        
        /**
         *  次の日ボタンをクリックしたら呼ばれる
         */
        goToNextDay: function () {
        }
    });

    module.exports = GlobalNavView;
});

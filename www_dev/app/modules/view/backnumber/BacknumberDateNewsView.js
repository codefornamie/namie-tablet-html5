define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var NewsView = require("modules/view/news/NewsView");
    
    /**
     * バックナンバー機能での記事一覧・詳細のメインとなる画面のViewクラスを作成する。
     * @class バックナンバー機能での記事一覧・詳細のメインとなる画面のViewクラス
     * @exports BacknumberDateNewsView
     * @constructor
     */
    var BacknumberDateNewsView = NewsView.extend({
//        afterRendered : function() {
//            $(".eventGlobal-nav").hide();
//            $(".contents-wrapper").css("padding-top","55px");
//        },

        /**
         * Google Analyticsでページビューを記録する
        */
        trackPageView : function() {
            app.ga.trackPageView("/BacknumberDateNewsView", "バックナンバーニュース");
        }
    });

    module.exports = BacknumberDateNewsView;
});

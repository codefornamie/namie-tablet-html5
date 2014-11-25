define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DateUtil = require("modules/util/DateUtil");

    /**
     * 記事詳細画面のViewクラス
     * 
     * @class 記事詳細画面のViewクラス
     * @exports ArticleDetailView
     * @constructor
     */
    var ArticleDetailView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/articleDetail"),
        
        beforeRendered : function() {

        },

        afterRendered : function() {
        },

        /**
         *  Viewを初期化する
         */
        initialize : function() {
            console.assert(this.model, 'model is not defined');

            console.log('[ArticleDetailView]', this.model);
        },

        events : {
        }
    });
    module.exports = ArticleDetailView;
});

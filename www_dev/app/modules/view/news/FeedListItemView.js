define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 記事一覧アイテム(メニュー用)のViewクラス
     * 
     * @class
     */
    var FeedListItemView = AbstractView.extend({
        animation: 'fadeIn',
        template : require("ldsh!/app/templates/news/feedListItem"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {
            var self = this;

            if (this.model.get("imageUrl")) {
                $(this.el).find("#articleImage").attr("src",this.model.get("imageUrl"));
            } else {
                $(this.el).find("#articleImage").parent().hide();
            }
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = FeedListItemView;
});

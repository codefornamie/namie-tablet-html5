define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 記事一覧アイテムのViewクラス
     */
    var ArticleListItemView = AbstractView.extend({
        animation: 'fadeIn',
        template : require("ldsh!/app/templates/news/articleListItem"),
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

    module.exports = ArticleListItemView;
});

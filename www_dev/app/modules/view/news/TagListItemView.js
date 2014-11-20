define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * タグ一覧アイテムのViewクラス
     */
    var TagListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/tagListItem"),
        events: {
        },

        beforeRendered : function() {
        },

        afterRendered : function() {
            this.setTagLabel();
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        },
        /**
         * タグに文字列をセットする
         */
        setTagLabel : function() {
            $(this.el).find(".deleteTag").text(this.tagLabel);
        },
    });

    module.exports = TagListItemView;
});

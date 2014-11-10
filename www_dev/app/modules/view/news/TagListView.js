define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var CommonUtil = require("modules/util/CommonUtil");
    var TagListItemView = require("modules/view/news/TagListItemView");

    /**
     * タグ一覧のViewクラス
     */
    var TagListView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/tagList"),
        events: {
        },

        beforeRendered : function() {
            this.setTagList();
        },

        afterRendered : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {

        },
        /**
         * 取得したタグ一覧を描画する
         */
        setTagList : function() {
            var self = this;
            _.each(this.tagsArray,$.proxy(function(tag) {
                var itemView = new TagListItemView();
                itemView.tagLabel = CommonUtil.sanitizing(tag);
                this.insertView(".tagList", itemView);
            }, this));
        },
    });

    module.exports = TagListView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 記事一覧アイテム(メニュー用)のViewを作成する。
     * 
     * @class 記事一覧アイテム(メニュー用)のView
     * @exports FeedListItemView
     * @constructor
     */
    var FeedListItemView = AbstractView.extend({
        /**
         * このViewのテンプレートファイパス
         * @memberof EventListItemView#
         */
        template : require("ldsh!templates/{mode}/news/feedListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberof EventListItemView#
         */
        afterRendered : function() {
            var self = this;
            var articleImageElement = this.$el.find(".articleImage");
            if (this.model.isPIOImage()) {
                this.showPIOImages(".articleImage", [
                    {
                        imageUrl : this.model.get("imageUrl"),
                        imageIndex : 1
                    }

                ]);
            } else if (!_.isEmpty(this.model.get("imageUrl"))) {
                articleImageElement.attr("src", this.model.get("imageUrl"));
            }
        }
    });

    module.exports = FeedListItemView;
});

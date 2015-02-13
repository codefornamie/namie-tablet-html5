define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");

    var AbstractView = require("modules/view/AbstractView");
    var SlideshowCollection = require("modules/collection/slideshow/SlideshowCollection");

    /**
     * スライドショー画面一覧アイテムのViewクラス
     * @class スライドショー画面一覧アイテムのViewクラス
     * @exports OpeSlideshowListItemView
     * @constructor
     */
    var OpeSlideshowListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/slideshow/slideshowListItem"),
        /**
         * このViewの親要素
         * @memberOf OpeSlideshowListItemView#
         */
        tagName : "tr",

        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlideshowListItemView#
         */
        beforeRendered : function() {
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlideshowListItemView#
         */
        afterRendered : function() {
            this.showPIOImages(".slideshowImage", [
                {
                    imageUrl : "slideshow/" + this.model.get("filename"),
                    imageIndex : 1
                }
            ]);
        },

        /**
         * 初期化処理
         * @memberOf NewsView#
         */
        initialize : function(options) {
        },
    });
    module.exports = OpeSlideshowListItemView;
});

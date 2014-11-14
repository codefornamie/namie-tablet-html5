define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var YouTubeCollection = require("modules/collection/youtube/YouTubeCollection");
    var YouTubeItemView = require("modules/view/top/YouTubeItemView");

    var YouTubeView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/youTubeList"),

        beforeRendered : function() {
            this.setPlayList();
        },

        afterRendered : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {

        },
        /**
         * 取得した動画一覧を描画する
         */
        setPlayList : function() {
            var self = this;
            this.parent.setVideo(this.collection.at(0));
            var animationDeley = 0;
            this.collection.each($.proxy(function(model) {
                this.insertView("#playListUl", new YouTubeItemView({
                    model : model,
                    animationDeley : animationDeley
                }));
                animationDeley += 0.2;
            }, this));

        }
    });

    module.exports = YouTubeView;
});

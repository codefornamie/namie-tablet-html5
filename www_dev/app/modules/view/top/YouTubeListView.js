define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var YouTubeCollection = require("modules/collection/youtube/YouTubeCollection");
    var YouTubeItemView = require("modules/view/top/YouTubeItemView");

    var YouTubeView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/top/youTubeList"),

        beforeRender : function() {
            this.setPlayList();
        },

        afterRender : function() {

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
            this.collection.each($.proxy(function(model) {
                var itemView = new YouTubeItemView();
                this.insertView("#playListUl", new YouTubeItemView({
                    model : model,
                }));
            }, this));

        }
    });

    module.exports = YouTubeView;
});

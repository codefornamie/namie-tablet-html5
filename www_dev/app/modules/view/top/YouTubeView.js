define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var YouTubeCollection = require("modules/collection/youtube/YouTubeCollection");
    var YouTubeListView = require("modules/view/top/YouTubeListView");

    var YouTubeView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/top/youTube"),
        /**
         * youtubePlayer
         */
        player : null,
        events : {
            "click .playListItem" : "onClickPlayList"
        },

        beforeRender : function() {

        },

        afterRender : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {
            this.collection = new YouTubeCollection();
            this.collection.channelId = "UC9_ZCtgOk8dPC6boqZMNqbw";

            var youTubeListView = new YouTubeListView();
            youTubeListView.collection = this.collection;
            youTubeListView.parent = this;
            this.setView(".youtubelist", youTubeListView);

            youTubeListView.listenTo(this.collection, "reset sync request", youTubeListView.render);

        },
        show : function() {
            this.setYouTubePlayer();
        },
        /**
         * youtube動画プレイヤーの設定
         */
        setYouTubePlayer : function() {
            this.player = new YT.Player('youtubePlayer', {
                width : '640',
                height : '390',
                events : {
                    "onReady" : $.proxy(this.onSetYouTubePlayer, this)
                }
            });
        },
        onSetYouTubePlayer : function() {
            gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
            gapi.client.load('youtube', 'v3', $.proxy(this.searchPlayList, this));
        },
        searchPlayList : function() {
            var self = this;
            this.collection.fetch({
                success : function success(model, response, options) {
                    console.log("success");
                },
                error : function error(model, response, options) {
                    console.log("error");
                }
            });
        },
        onClickPlayList : function(ev) {
            var videoId = $(ev.currentTarget).attr("videoId");
            var video = this.collection.find(function(item) {
                return item.get('videoId') === videoId;
            });
            this.setVideo(video);
        },
        setVideo : function(video) {
            if (!this.player || !video) {
                return;
            }
            this.player.loadVideoById(video.get("videoId"));
            $("#videoTitle").text(video.get("title"));
            $("#videoDescription").text(video.get("description"));
        }

    });

    module.exports = YouTubeView;
});

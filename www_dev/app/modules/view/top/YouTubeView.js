define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var YouTubeCollection = require("modules/collection/youtube/YouTubeCollection");
    var YouTubeListView = require("modules/view/top/YouTubeListView");

    var YouTubeView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/youTube"),
        /**
         * youtubePlayer
         */
        player : null,
        events : {
            "click .playListItem" : "onClickPlayList"
        },

        beforeRendered : function() {

        },

        afterRendered : function() {
            this.requestGoogleAPIClient();
        },

        /**
         * 初期化処理
         */
        initialize : function() {
        },

        /**
         * Google API clientを初期化する
         */
        requestGoogleAPIClient : function() {
            if (app.gapiLoaded) {
                this.initYouTubeView();
                return;
            }

            var self = this;
            window.googleApiClientReady = function() {
                delete window.googleApiClientReady;

                window.onYouTubeIframeAPIReady = function() {
                    delete window.onYouTubeIframeAPIReady;
                    app.gapiLoaded = true;

                    self.initYouTubeView();
                };

                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            };

            var tag = document.createElement('script');
            tag.src = "https://apis.google.com/js/client.js?onload=googleApiClientReady";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        },
        
        /**
         *  YouTubeViewを初期化する
         *  GoogleAPIの初期化が済んだら呼ばれる
         */
        initYouTubeView: function () {
            this.collection = new YouTubeCollection();
            this.collection.channelId = "UC9_ZCtgOk8dPC6boqZMNqbw";

            var youTubeListView = new YouTubeListView();
            youTubeListView.collection = this.collection;
            youTubeListView.parent = this;
            this.setView("#sidebar__list", youTubeListView);

            youTubeListView.listenTo(this.collection, "reset sync request", youTubeListView.render);

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
            this.player.removeEventListener("onReady");
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
        },

        cleanup : function() {
            try {
                this.player.destroy();
            } catch(e) {
                console.log(e);
            }
            
        }
    });

    module.exports = YouTubeView;
});

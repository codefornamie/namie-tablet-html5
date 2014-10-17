define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var TopView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/top/top"),
        /**
         * youtubePlayer
         **/
        player : null,
        events : {
            "click .playListItem":"onClickPlayList"
        },

        beforeRender : function() {

        },

        afterRender : function() {
            var tag = document.createElement('script');
            
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            setTimeout($.proxy(function () {
                this.setYouTubePlayer();
            },this),1600);

        },
        /**
         * 初期化処理
         */
        initialize : function() {
            var tag = document.createElement('script');
            
            tag.src = "https://apis.google.com/js/client.js";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        },
        /**
         * youtube動画プレイヤーの設定
         */
        setYouTubePlayer : function () {
            this.player = new YT.Player('youtubePlayer', {
                width: '640',
                height: '390',
                events:{
                    "onReady": $.proxy(this.onSetYouTubePlayer,this)
                }
            });
        },
        onSetYouTubePlayer : function () {
            gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
            gapi.client.load('youtube', 'v3', $.proxy(this.searchPlayList,this));
        },
        searchPlayList : function () {
            this.channelsVideos("UC9_ZCtgOk8dPC6boqZMNqbw");
        },
        channelsVideos : function(channelId) {
            gapi.client.request({
                path : "/youtube/v3/search",
                mine : false,
                params : {
                    channelId : channelId,
                    type : "video",
                    part : "id,snippet",
                    maxResults : 5,
                    order : "date",
                },
                callback : $.proxy(this.setPlayList,this)
            });
        },
        /**
         * 取得した動画一覧を描画する
         */
        setPlayList : function (res) {
            var playList = res.items;
            this.setVideo(playList[0]);
            _.each(playList, $.proxy(function (item) {
                var elem = $('<li class="playListItem" style="white-space: pre;border-top:solid 1px;"><span class="videoTitle" style="font-size: small;font-weight:bold;"></span><img/></li><span class="descriptionText" style="font-size: small;"></span>');
                elem.find("img").attr("src",item.snippet.thumbnails["default"].url);
                elem.attr("videoId",item.id.videoId);
                elem.find(".videoTitle").text(item.snippet.title);
                $(elem[1]).text(item.snippet.description);
                $("#playListUl").append(elem);
            },this));
            
        },
        onClickPlayList : function(ev) {
            var item = {
                    id : {videoId :$(ev.currentTarget).attr("videoId")},
                    snippet : {
                        title: $(ev.currentTarget).text(),
                        description: $(ev.currentTarget).next().text()
                    }
            };
            this.setVideo(item);
        },
        setVideo :function (video) {
            this.player.loadVideoById(video.id.videoId);
            $("#videoTitle").text(video.snippet.title);
            $("#videoDescription").text(video.snippet.description);
        }

    });

    module.exports = TopView;
});

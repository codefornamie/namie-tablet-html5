define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 新聞アプリの福島TVのニュースを表示するためのViewを作成する。
     * 
     */
    var YouTubeListItemView = AbstractView.extend({
        /**
         * Viewのテンプレートファイルパス
         */
        template : require("ldsh!/app/templates/news/youTubeListItem"),
        /**
         * YouTubePlayerのインスタンス
         */
        player : null,

        /**
         * Viewのテンプレートの描画が完了した後に呼び出されるコールバック関数。
         */
        afterRendered : function() {
            this.setYouTubePlayer();
        },

        /**
         * 初期化処理
         */
        initialize : function() {
        },

        /**
         * YouTube動画プレイヤーの設定
         */
        setYouTubePlayer : function() {
            this.player = new YT.Player('youtubePlayer-' + this.model.get("videoId"), {
                width : '640',
                height : '390',
                playerVars : {
                    'autoplay' : 0,
                    'controls' : 1
                },
                events : {
                    "onReady" : $.proxy(this.onSetYouTubePlayer, this)
                }
            });
        },

        /**
         * YouTube動画プレイヤーの初期化処理が完了し、利用可能な状態になった場合に呼び出されるコールバック関数。
         */
        onSetYouTubePlayer : function() {
            this.player.removeEventListener("onReady");
            gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
            gapi.client.load('youtube', 'v3', $.proxy(this.onLoadYoutubePlayer, this));
        },
        /**
         * YouTube動画プレイヤークライアントの読み込み処理が完了し、動画再生可能な状態になった場合に呼び出されるコールバック関数。
         */
        onLoadYoutubePlayer : function() {
            this.setVideo(this.model);
        },

        /**
         * このViewで表示するYouTube動画をYouTube動画プレイヤーに設定する。
         */
        setVideo : function(video) {
            if (!this.player || !video) {
                return;
            }
            this.player.cueVideoById(video.get("videoId"));
            $("#videoTitle").text(video.get("title"));
            $("#videoDescription").text(video.get("description"));
        },

        /**
         * Viewが破棄された際に呼び出されるコールバック関数。
         * <p>
         * YouTube動画プレイヤーのインスタンスを破棄する。
         * </p>
         */
        cleanup : function() {
            try {
                this.player.destroy();
            } catch (e) {
                console.log(e);
            }
        }
    });

    module.exports = YouTubeListItemView;
});

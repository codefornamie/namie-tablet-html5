define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 新聞アプリの福島TVのニュースを表示するためのViewを作成する。
     * 
     * @class 新聞アプリの福島TVのニュースを表示するためのView
     * @exports YouTubeListItemView
     * @constructor
     */
    var YouTubeListItemView = ArticleListItemView.extend({
        /**
         * Viewのテンプレートファイルパス
         */
        template : require("ldsh!templates/{mode}/news/youTubeListItem"),
        /**
         * YouTubePlayerのインスタンス
         */
        player : null,
        /**
         * YouTubeの動画再生プレイヤーを表示する。<br/>
         * このメソッドは、View#afterRenderメソッド処理完了後に呼び出される。
         */
        showImage : function() {
            this.setYouTubePlayer();
        },

        /**
         * YouTube動画プレイヤーの設定を行う。
         */
        setYouTubePlayer : function() {
            this.player = new YT.Player('youtubePlayer-' + this.model.get("link"), {
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
            this.player.cueVideoById(video.get("link"));
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

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
         * Youtubeライブラリが準備できてなければ、最大時間まで待つ。
         */
        waitReadyYoutube : function(callback) {
            var counter = 0;
            var id = setInterval(function() {
                if (counter > 10) {
                    clearInterval(id);
                    callback();
                }
                if (YT.Player) {
                    clearInterval(id);
                    callback();
                }
                counter += 1;
            }, 100);
        },

        /**
         * YouTube動画プレイヤーの設定を行う。
         */
        setYouTubePlayer : function() {
            this.waitReadyYoutube($.proxy(function() {
                if (YT.Player) {
                    this.player = new YT.Player('youtubePlayer-' + this.model.get("link"), {
                        width : '640',
                        height : '390',
                        playerVars : {
                            'autoplay' : 0,
                            'controls' : 1
                        },
                        events : {
                            "onReady" : $.proxy(this.onSetYouTubePlayer, this),
                            "onStateChange" : $.proxy(function(event) {
                                app.logger.debug("Youtube state change. state=" + event.data);
                                if (event.data === YT.PlayerState.PLAYING) {
                                    // 動画開始されたら動画再生ボタンを表示
                                    $("[data-play-movie]").show();
                                }
                            }, this)
                        }
                    });
                }
            }, this));
        },

        /**
         * YouTube動画プレイヤーの初期化処理が完了し、利用可能な状態になった場合に呼び出されるコールバック関数。
         */
        onSetYouTubePlayer : function() {
            this.player.removeEventListener("onReady");
            gapi.client.load('youtube', 'v3', $.proxy(this.onLoadYoutubePlayer, this));
        },
        /**
         * YouTube動画プレイヤークライアントの読み込み処理が完了し、動画再生可能な状態になった場合に呼び出されるコールバック関数。
         */
        onLoadYoutubePlayer : function() {
            this.setVideo(this.model);
            this.setOperationEvent();
        },
        /**
         * 動画操作用のイベントを設定する
         * @memberOf YouTubeListItemView#
         */
        setOperationEvent : function() {
            var self = this;
            // 再生の設定
            $("[data-play-movie]").click(function() {
                self.player.playVideo();
            });
            // 一時停止の設定
            $("[data-pause-movie]").click(function() {
                self.player.pauseVideo();
            });
            // 音量の設定
            $(this.el).foundation('slider', 'reflow');
            $("[data-slider]").on("change.fndtn.slider", function() {
                var volume = $(this).attr('data-slider');
                $("#volumeOutput").text(volume.toString());
                self.player.setVolume(volume);
            });
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
                $("[data-play-movie]").unbind("click");
                $("[data-pause-movie]").unbind("click");
                $("[data-slider]").unbind("change.fndtn.slider");
                this.player.destroy();
            } catch (e) {
                app.logger.debug(e);
            }
        }
    });

    module.exports = YouTubeListItemView;
});

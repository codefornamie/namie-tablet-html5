define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Code = require("modules/util/Code");
    var AbstractView = require("modules/view/AbstractView");

    /**
     *  道場アプリの初回説明画面を表示するためのViewクラスを作成する。
     *
     *  @class 道場アプリの初回説明画面を表示するためのView
     *  @exports DojoIntroductionView
     *  @constructor
     */
    var DojoIntroductionView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/top/dojoIntroduction"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         *  @memberOf DojoIntroductionView#
         */
        afterRendered : function() {
            if(!this.isFirst) {
                $("[data-dojo-introduction-closer]").text("コース一覧へ");
            }
            this.setYouTubePlayer();

            // アプリがバックグラウンドになった場合、youtubeを一時停止する
            var self = this;
            this.onPause = function () {
                if(self.player){
                    self.player.pauseVideo();
                }
            };
            document.addEventListener("pause", this.onPause, false);

            var $fadeIn = this.$el.find('[data-fade-in]');

            // ダイアログをフェードインさせる
            setTimeout(function () {
                $fadeIn.addClass('is-ready');
            }, 0);
        },

        /**
         *  初期化処理
         *  @memberOf DojoIntroductionView#
         */
        initialize : function() {
        },

        events : {
            'click [data-dojo-introduction-closer]': 'onClickIntroductionCloser'
        },

        /**
         * YouTube動画プレイヤーの設定を行う。
         *  @memberOf DojoIntroductionView#
         */
        setYouTubePlayer : function() {
            if (YT.Player) {
                this.player = new YT.Player("dojo-introduction-dialog__content", {
                    height : '300',
                    playerVars : {
                        'autoplay' : 0,
                        'controls' : 1,
                        // 関連動画抑止
                        'rel' : 0,
                        // YouTubeロゴ非表示
                        'modestbranding' : 1
                    },
                    events : {
                        "onReady" : $.proxy(function() {
                            this.player.removeEventListener("onReady");
                            gapi.client.load('youtube', 'v3', $.proxy(this.onLoadYoutubePlayer, this));
                        }, this),
                        "onStateChange" : $.proxy(function(event) {
                            app.logger.debug("Youtube state change. state=" + event.data);
                            if (event.data === YT.PlayerState.PLAYING) {
                                // 動画が再生可能になったらボタンを有効化する
                                $(".dojo-introduction-dialog__movie-control").css("visibility", "visible");

                                // 動画再生したら動画停止ボタンを表示
                                $("[data-play-movie]").hide();
                                $("[data-pause-movie]").show();
                            } else if (event.data === YT.PlayerState.PAUSED) {
                                // 動画停止したら動画再生ボタンを表示
                                $("[data-play-movie]").show();
                                $("[data-pause-movie]").hide();
                            }
                        }, this)
                    }
                });
            }
        },
        /**
         * このViewで表示するYouTube動画をYouTube動画プレイヤーに設定する。
         *  @memberOf DojoIntroductionView#
         */
        onLoadYoutubePlayer : function() {
            if (!this.player) {
                return;
            }
            this.player.cueVideoById(Code.DOJO_INTORODUCTION_VIDEO_ID);
            this.setOperationEvent();
        },
        /**
         * 動画操作用のイベントを設定する
         *  @memberOf DojoIntroductionView#
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
        },

        /**
         *  初回説明画面を閉じる。閉じるボタンが押されたら呼ばれる
         *  @param {Event} ev
         *  @memberOf DojoIntroductionView#
         */
        onClickIntroductionCloser: function (ev) {
            var self = this;
            var $fadeIn = this.$el.find('[data-fade-in]');

            ev.preventDefault();

            // ダイアログをフェードアウトさせる
            setTimeout(function () {
                $fadeIn.removeClass('is-ready');
            }, 0);

            // CSSトランジションの完了後に閉じる
            setTimeout(function () {
                self.remove();
                app.router.back();
            }, 300);
        },
        /**
         * Viewが破棄された際に呼び出されるコールバック関数。
         * <p>
         * YouTube動画プレイヤーのインスタンスを破棄する。
         * </p>
         * @memberOf DojoIntroductionView#
         */
        cleanup : function() {
            try {
                if(this.onPause){
                    document.removeEventListener("pause", this.onPause, false);
                    this.onPause = null;
                }
                $("[data-play-movie]").unbind("click");
                $("[data-pause-movie]").unbind("click");
                if (this.player) {
                    this.player.destroy();
                }
         } catch (e) {
                app.logger.debug(e);
            }

            $(document).trigger("close:modal");
        }

    });

    module.exports = DojoIntroductionView;
});

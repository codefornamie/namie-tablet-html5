/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Code = require("modules/util/Code");
    var AbstractView = require("modules/view/AbstractView");

    /**
     *  放射線アプリの使い方画面を表示するためのViewクラスを作成する。
     *
     *  @class 放射線アプリの使い方画面を表示するためのView
     *  @exports RadTutorialView
     *  @constructor
     */
    var RadTutorialView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/top/radTutorial"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         *  @memberOf RadTutorialView#
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         *  @memberOf RadTutorialView#
         */
        afterRendered : function() {
            // TODO: Google Analytics
            //app.ga.trackPageView("Tutorial", "放射線アプリの使い方ページ表示");
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
         *  @memberOf RadTutorialView#
         */
        initialize : function() {
        },

        events : {
            'click [data-rad-tutorial-closer]': 'onClickTutorialCloser'
        },

        /**
         * YouTube動画プレイヤーの設定を行う。
         *  @memberOf RadTutorialView#
         */
        setYouTubePlayer : function() {
            if (YT.Player) {
                this.player = new YT.Player("rad-tutorial-dialog__content", {
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
                                $(".rad-tutorial-dialog__movie-control").css("visibility", "visible");

                                // 動画再生したら動画停止ボタンを表示
                                $("[data-play-movie]").hide();
                                $("[data-pause-movie]").show();
                                // TODO: Google Analytics
                                //app.ga.trackEvent("放射線アプリの使い方ページ", "動画再生ボタン押下");
                            } else if (event.data === YT.PlayerState.PAUSED) {
                                // 動画停止したら動画再生ボタンを表示
                                $("[data-play-movie]").show();
                                $("[data-pause-movie]").hide();
                                if (this.player.getCurrentTime() !== this.player.getDuration()) {
                                    // TODO: Google Analytics
                                    //app.ga.trackEvent("放射線アプリの使い方ページ", "動画一時停止ボタン押下");
                                }
                            }
                        }, this)
                    }
                });
            }
        },
        /**
         * このViewで表示するYouTube動画をYouTube動画プレイヤーに設定する。
         *  @memberOf RadTutorialView#
         */
        onLoadYoutubePlayer : function() {
            if (!this.player) {
                return;
            }
            this.player.cueVideoById(Code.RAD_TUTORIAL_VIDEO_ID);
            this.setOperationEvent();
        },
        /**
         * 動画操作用のイベントを設定する
         *  @memberOf RadTutorialView#
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
         *  @memberOf RadTutorialView#
         */
        onClickTutorialCloser: function (ev) {
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
            }, 300);
            if ($(ev.target).hasClass("dojo-lesson__back")) {
                // TODO: Google Analytics
                //app.ga.trackEvent("放射線アプリの使い方ページ", "「閉じる」ボタン押下");
            } else {
                // TODO: Google Analytics
                //app.ga.trackEvent("放射線アプリの使い方ページ", $(event.target).text());
            }
            
        },
        /**
         * Viewが破棄された際に呼び出されるコールバック関数。
         * <p>
         * YouTube動画プレイヤーのインスタンスを破棄する。
         * </p>
         * @memberOf RadTutorialView#
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

    module.exports = RadTutorialView;
});

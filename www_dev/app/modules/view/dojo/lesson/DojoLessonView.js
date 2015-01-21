define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoLessonSiblingsView = require("modules/view/dojo/lesson/DojoLessonSiblingsView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");
    var AchievementModel = require("modules/model/misc/AchievementModel");
    var Code = require("modules/util/Code");
    var vexDialog = require("vexDialog");

    /**
     * 道場アプリの個別画面のViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoLessonView
     * @constructor
     */
    var DojoLessonLayout = Backbone.Layout.extend({
        template : require("ldsh!templates/{mode}/lesson/dojoLesson"),

        /**
         * テンプレートに渡す情報をシリアライズする
         * @return {Object}
         * @memberOf DojoLessonLayout#
         */
        serialize : function() {
            return {
                model : this.dojoContentModel,
                editionModel : this.dojoEditionModel
            };
        },

        /**
         * Layoutの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoLessonLayout#
         */
        afterRender : function() {
            this.dojoLessonSiblingsView.render();
            this.setYouTubePlayer();
            $('.is-grayedout').unblock(); 

            $(document).trigger("open:modal");

            // アプリがバックグラウンドになった場合、youtubeを一時停止する
            var self = this;
            this.onPause = function () {
                if(self.player){
                    self.player.pauseVideo();
                }
            };
            document.addEventListener("pause", this.onPause, false);
        },
        /**
         * イベント一覧
         */
        events : {
            "click [data-playback-lesson]" : "onClickPlaybackLesson",
            "click [data-complete-lesson]" : "onClickCompleteLesson",
            "click [data-uncomplete-lesson]" : "onClickUncompleteLesson",
            "click [data-back]" : "onClickBack"
        },

        /**
         * 現在のコースが制覇されているかどうかを返す
         * <p>
         * onClickCompleteLesson内から呼び出す
         * </p>
         * @memberOf DojoLessonLayout#
         * @return {boolean}
         */
        isLevelCompleted : function() {
            var contentCollection = this.dojoEditionModel.get('contentCollection');
            var modelArray;
            var solvedModelCount;

            // 現在のコース内の動画を抽出
            modelArray = contentCollection.filter(function(item) {
                return item.get("level") === app.currentDojoLevel;
            });

            // 習得済みモデル数をカウントする
            solvedModelCount = _.filter(modelArray, function(model) {
                return model.getSolvedState() === Code.DOJO_STATUS_SOLVED;
            }).length;

            // 現在のコース内の動画が全て習得されているかどうかを返す
            return solvedModelCount === modelArray.length;
        },

        /**
         * はいボタンを押したら呼ばれる
         * @memberOf DojoLessonLayout#
         * @param {Event} ev
         */
        onClickCompleteLesson : function(ev) {
            var isLevelCompletedBefore;

            if (this.dojoContentModel.achievementModels) {
                var solvedAchievement = _.find(this.dojoContentModel.achievementModels, function(achievement) {
                    return achievement.get("type") === "dojo_solved";
                });

                if (solvedAchievement) {
                    this.onClickBack(ev);
                    return;
                }
            }

            // 現在の動画を修得する前にレベル制覇していたかどうかを取得
            isLevelCompletedBefore = this.isLevelCompleted();

            // 習得済みとしてセーブする
            var achievementModel = new AchievementModel();
            achievementModel.set("type", "dojo_solved");
            achievementModel.set("action", this.dojoContentModel.get("videoId"));
            achievementModel.set("count", "1");
            achievementModel.set("lastActionDate", new Date().toISOString());
            achievementModel.save(null, {
                success : $.proxy(function() {
                    this.onSaveAchievement(achievementModel);

                    // 現在の動画を習得した時点で現在のコースを制覇した場合は、コース制覇画面へ遷移する
                    // そうでない場合は、動画一覧へ戻る
                    if (!isLevelCompletedBefore && this.isLevelCompleted()) {
                        app.router.go("dojo", "levels", app.currentDojoLevel, "finished");
                    } else {
                        this.onClickBack(ev);
                    }
                }, this)
            });
        },
        /**
         * 達成状況情報保存後のコールバック関数
         * @memberOf DojoLessonLayout#
         * @param {AchievementModel} 新規保存後の達成状況情報
         */
        onSaveAchievement : function(achievementModel) {
            if (!this.dojoContentModel.achievementModels) {
                this.dojoContentModel.achievementModels = [];
            }
            this.dojoContentModel.achievementModels.push(achievementModel);
            $("[data-complete-lesson]").removeAttr("disabled");
        },

        /**
         * いいえボタンを押したら呼ばれる
         * @memberOf DojoLessonLayout#
         */
        onClickPlaybackLesson: function () {
            this.$el.find("#dojo-lesson")
                .removeClass("is-ended")
                .addClass("is-ready");

            this.player.seekTo(0);
        },

        /**
         * いいえボタンを押したら呼ばれる
         * @memberOf DojoLessonLayout#
         */
        onClickUncompleteLesson : function() {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = "OK";
            vexDialog.alert("習得できるように頑張りましょう！");
        },

        /**
         * 動画一覧へ戻るボタンを押したら呼ばれる
         * @memberOf DojoLessonLayout#
         * @param {Event} ev
         */
        onClickBack : function(ev) {
            ev.preventDefault();

            app.router.go("dojo", "levels", app.currentDojoLevel);
        },

        /**
         * 初期化
         * @memberOf DojoLessonLayout#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.dojoEditionModel, "param.dojoEditionModel should be specified");
            console.assert(param.dojoContentModel, "param.dojoContentModel should be specified");

            this.dojoEditionModel = param.dojoEditionModel;
            this.dojoContentModel = param.dojoContentModel;

            // 関連コンテンツのviewを生成する
            var dojoLessonSiblingsView = this.dojoLessonSiblingsView = new DojoLessonSiblingsView({
                dojoEditionModel : param.dojoEditionModel,
                dojoContentModel : param.dojoContentModel
            });

            this.setView(DojoLessonLayout.SELECTOR_SIBLINGS, dojoLessonSiblingsView);
        },
        /**
         * YouTube動画プレイヤーの設定を行う。
         * @memberOf DojoLessonLayout#
         */
        setYouTubePlayer : function() {
            if (YT.Player) {
                this.player = new YT.Player("dojo-lesson__content", {
                    height : '400',
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
                                // 動画開始されたら動画再生ボタンを表示
                                $("[data-play-movie]").show();
                            }
                            if (event.data === YT.PlayerState.ENDED) {
                                // 動画終了時に習得確認テキストを出す
                                this.onEndYouTube();
                            }
                        }, this)
                    }
                });
            }
        },
        /**
         * このViewで表示するYouTube動画をYouTube動画プレイヤーに設定する。
         * @memberOf DojoLessonLayout#
         */
        onLoadYoutubePlayer : function() {
            if (!this.player) {
                return;
            }
            this.player.cueVideoById(this.dojoContentModel.get("videoId"));
            this.setOperationEvent();
        },
        /**
         * 動画操作用のイベントを設定する
         * @memberOf DojoLessonLayout#
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
         * YouTube再生が終了した後に呼ばれる
         * @memberOf DojoLessonLayout#
         */
        onEndYouTube: function () {
            this.$el.find("#dojo-lesson")
                .removeClass("is-ready")
                .addClass("is-ended");
            
            this.saveWatchedAchievement();
        },
        /**
         * 視聴済み情報保存処理
         * @memberOf DojoLessonLayout#
         */
        saveWatchedAchievement: function () {
            if (this.dojoContentModel.achievementModels) {
                var watchedAchievement = _.find(this.dojoContentModel.achievementModels, function(achievement) {
                    return achievement.get("type") === "dojo_watched";
                });
                if (watchedAchievement) {
                    return;
                }
            }

            // 視聴済み情報のセーブ
            var achievementModel = new AchievementModel();
            achievementModel.set("type", "dojo_watched");
            achievementModel.set("action", this.dojoContentModel.get("videoId"));
            achievementModel.set("count", "1");
            achievementModel.set("lastActionDate", new Date().toISOString());
            achievementModel.save(null, {
                success : $.proxy(function() {
                    app.logger.info("success dojo_watched save. videoId=" + this.dojoContentModel.get("videoId"));
                    if (this.dojoContentModel.achievementModels) {
                        this.dojoContentModel.achievementModels.push(achievementModel);
                    } else {
                        this.dojoContentModel.achievementModels = [achievementModel];
                    }
                }, this),
                error : $.proxy(function() {
                    app.logger.error("error dojo_watched save. videoId=" + this.dojoContentModel.get("videoId"));
                }, this)
            });
        },

        /**
         * Viewが破棄された際に呼び出されるコールバック関数。
         * <p>
         * YouTube動画プレイヤーのインスタンスを破棄する。
         * </p>
         * @memberOf DojoLessonLayout#
         */
        cleanup : function() {
            try {
                if(this.onPause){
                    document.removeEventListener("pause", this.onPause, false);
                    this.onPause = null;
                }
                $("[data-play-movie]").unbind("click");
                $("[data-pause-movie]").unbind("click");
                $("[data-slider]").unbind("change.fndtn.slider");
                this.player.destroy();
         } catch (e) {
                app.logger.debug(e);
            }

            $(document).trigger("close:modal");
        }
    }, {
        /**
         * 関連コンテンツのセレクタ
         */
        SELECTOR_SIBLINGS : "#dojo-lesson-siblings-container",
    });

    /**
     * 道場アプリの個別画面のViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoLessonView
     * @constructor
     */
    var DojoLessonView = AbstractView.extend({
        /**
         * 初期化
         * @memberOf DojoLessonView#
         * @param {Object} param
         */
        initialize : function(param) {
            var dojoEditionModel = this.dojoEditionModel = new DojoEditionModel();
            var dojoContentModel = this.dojoContentModel = new DojoContentModel();

            this.layout = new DojoLessonLayout({
                dojoEditionModel : dojoEditionModel,
                dojoContentModel : dojoContentModel
            });
        }
    });

    module.exports = DojoLessonView;
});
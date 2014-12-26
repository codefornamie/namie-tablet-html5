define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoLessonSiblingsView = require("modules/view/dojo/lesson/DojoLessonSiblingsView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");
    var AchievementModel = require("modules/model/misc/AchievementModel");
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
         */
        serialize : function() {
            return {
                model : this.dojoContentModel,
                editionModel : this.dojoEditionModel
            };
        },

        afterRender : function() {
            this.dojoLessonSiblingsView.render();
            this.setYouTubePlayer();
        },
        /**
         * イベント一覧
         */
        events : {
            "click [data-complete-lesson]" : "onClickCompleteLesson",
            "click [data-uncomplete-lesson]" : "onClickUncompleteLesson",
        },
        /**
         * はいボタンを押したら呼ばれる
         * @memberof DojoLessonLayout#
         */
        onClickCompleteLesson : function() {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = "OK";
            vexDialog.alert("この操作を習得しました！！");
            if (this.dojoContentModel.achievementModels) {
                var solvedAchievement = _.find(this.dojoContentModel.achievementModels, function(achievement) {
                    return achievement.get("type") === "dojo_solved";
                });
                if (solvedAchievement) {
                    return;
                }
            }
            $("[data-complete-lesson]").attr("disabled", "disabled");
            var achievementModel = new AchievementModel();
            achievementModel.set("type", "dojo_solved");
            achievementModel.set("action", this.dojoContentModel.get("videoId"));
            achievementModel.set("count", "1");
            achievementModel.set("lastActionDate", new Date().toISOString());
            achievementModel.save(null, {
                success : $.proxy(function() {
                    this.onSaveAchievement(achievementModel);
                }, this)
            });
        },
        /**
         * 達成状況情報保存後のコールバック関数
         * @memberof DojoLessonLayout#
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
         * @memberof DojoLessonLayout#
         */
        onClickUncompleteLesson : function() {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = "OK";
            vexDialog.alert("習得できるように頑張りましょう！");
        },

        /**
         * 初期化
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
         * @memberof DojoLessonLayout#
         */
        setYouTubePlayer : function() {
            if (YT.Player) {
                this.player = new YT.Player("dojo-lesson__content", {
                    height : '400',
                    playerVars : {
                        'autoplay' : 0,
                        'controls' : 1
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
                                // 動画終了時に習得済みとする
                                this.onClickCompleteLesson();
                            }
                        }, this)
                    }
                });
            }
        },
        /**
         * このViewで表示するYouTube動画をYouTube動画プレイヤーに設定する。
         * @memberof DojoLessonLayout#
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
         * @memberof DojoLessonView#
         * @param {Object} param
         */
        initialize : function(param) {
            var dojoEditionModel = this.dojoEditionModel = new DojoEditionModel();
            var dojoContentModel = this.dojoContentModel = new DojoContentModel();

            this.layout = new DojoLessonLayout({
                dojoEditionModel : dojoEditionModel,
                dojoContentModel : dojoContentModel
            });
        },
    });

    module.exports = DojoLessonView;
});
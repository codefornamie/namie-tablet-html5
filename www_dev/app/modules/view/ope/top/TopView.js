define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var AbstractView = require("modules/view/AbstractView");
    var OpeNewsView = require("modules/view/ope/news/OpeNewsView");
    var foundationCalendar = require("foundation-calendar");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var YouTubeCollection = require("modules/collection/dojo/YouTubeCollection");
    var AchievementCollection = require("modules/collection/misc/AchievementCollection");
    var DojoAchievementCsvModel = require("modules/model/misc/DojoAchievementCsvModel");
    var PersonalCollection = require("modules/collection/personal/PersonalCollection");
    var IsNull = require("modules/util/filter/IsNull");
    var Equal = require("modules/util/filter/Equal");
    var vexDialog = require("vexDialog");

    /**
     * 運用管理アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/top"),

        /**
         * このViewのイベント
         * @memberOf TopView#
         */
        events : {
            "click [data-dojo-achievement-button]" : "onClickDojoAchievementButton"
        },
        /**
         * 描画前に実行する処理。
         * @memberOf TopView#
         */
        beforeRendered : function() {
            this.$el.foundation();
        },

        /**
         * 描画後に実行する処理。
         * @memberOf TopView#
         */
        afterRendered : function() {
            // カレンダー表示
            var calendar = this.$el.find("[data-date]");
            var targetDate;
            if (this.targetDate) {
                targetDate = this.targetDate;
            } else {
                var date = new Date();
                targetDate = date.format("%Y-%m-%d");
            }
            var newsView = new OpeNewsView({targetDate:targetDate});
            calendar.val(targetDate);
            calendar.fcdp({
                fixed : true,
                dateSelector : true,
            });
            calendar.bind('dateChange', function(evt, opts) {
                console.info('dateChange triggered');
                var targetDate = new Date(evt.target.value);
                newsView.setDate(targetDate);

                targetDate = targetDate.format("%Y-%m-%d");
                newsView.targetDate = targetDate;
            });

            // 記事一覧を表示
            this.setView("#opeNewsList", newsView).render();
            newsView.setDate(this.targetDate ? new Date(this.targetDate) : new Date());
            $("[data-sequence-register-button]").show();
        },
        /**
         * youtubeライブラリを読み込む
         * 
         * @memberOf TopView#
         * @param {Function} callback
         */
        loadYouTubeLibrary : function(callback) {
            if (app.gapiLoaded) {
                callback();
                return;
            }
            var self = this;
            var loadScript = function(url) {
                return function(next) {
                    $.getScript(url).done(function() {
                        next(null);
                    }).fail(function(jqXHR, settings, err) {
                        next(err);
                    });
                };
            };
            var onLoadGAPI = function(next) {
                window.onLoadGAPI = function() {
                    delete window.onLoadGAPI;
                    next(null);
                };

                loadScript("https://apis.google.com/js/client.js?onload=onLoadGAPI")(function(err) {
                    if (err) {
                        next(err);
                        return;
                    }
                });
            };
            async.series([
                    onLoadGAPI, loadScript("https://www.youtube.com/iframe_api")
            ], function(err) {
                if (!err) {
                    app.gapiLoaded = true;
                }
                callback(err);
            });
        },
        /**
         * 町民の道場動画達成状況CSVダウンロードボタンを押下された際の処理
         * @memberOf TopView#
         */
        onClickDojoAchievementButton : function() {
            this.loadYouTubeLibrary($.proxy(function() {
                // youtubeAPI読み込み
                gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
                gapi.client.load('youtube', 'v3', $.proxy(this.searchDojoCsvInfo, this));
            }, this));

        },
        /**
         * 町民の道場動画達成状況CSV用の情報取得
         * @memberOf TopView#
         */
        searchDojoCsvInfo : function() {
            async.parallel([
                            this.loadDojoContentCollection.bind(this),
                            this.loadPersonalCollection.bind(this),
                            this.loadAchievementCollection.bind(this),
                    ], this.onAllFetch.bind(this));
        },
        /**
         * 道場動画情報の取得
         * @memberOf TopView#
         */
        loadDojoContentCollection : function(callback) {
            
            var onYoutubeFetch = function(next) {
                this.youtubeCollection = new YouTubeCollection();
                this.youtubeCollection.channelId = "UCSeFpozPKXTm_frDTqccxpQ";
                this.youtubeCollection.fetch({
                    success : $.proxy(function() {
                        next(null);
                    }, this),
                    error : function error(err) {
                        next(err);
                    }
                });
            };

            var onDojoMovieFetch = function(next) {
                this.dojoContentCollection = new DojoContentCollection();
                this.dojoContentCollection.condition.filters = [
                    new IsNull("deletedAt")
                ];
                this.dojoContentCollection.youtubeCollection = this.youtubeCollection;
                this.dojoContentCollection.fetch({
                    success : function() {
                        next(null);
                    },
                    error : function (err) {
                        next(err);
                    }
                });
            };

            async.series([
                    onYoutubeFetch.bind(this), onDojoMovieFetch.bind(this)
            ], function(err) {
                callback(err);
            });
            
        },
        /**
         * パーソナル情報の取得
         * @memberOf TopView#
         */
        loadPersonalCollection : function(callback) {
            this.personalCollection = new PersonalCollection();
            this.personalCollection.fetch({
                success : function() {
                    callback();
                },
                error : function (ev) {
                    callback(ev);
                }
            });
        },
        /**
         * 達成情報の取得
         * @memberOf TopView#
         */
        loadAchievementCollection : function(callback) {
            this.achievementCollection = new AchievementCollection();
            this.achievementCollection.condition.filters = [
                new Equal("type", "dojo_solved")
            ];
            this.achievementCollection.fetch({
                success : function() {
                    callback();
                },
                error : function (ev) {
                    callback(ev);
                }
            });
        },
        /**
         * 道場動画・パーソナル・達成状況の取得完了後に呼ばれる
         * @memberOf TopView#
         */
        onAllFetch : function(err) {
            if (err) {
                app.logger.error("error OPE:TopView:onAllFetch");
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("道場達成状況情報の取得に失敗しました。");
                return;
            }
            // 動画と達成情報の連結を行う
            if (this.achievementCollection.size() !== 0) {
                this.achievementCollection.each($.proxy(function(achievement) {
                    this.dojoContentCollection.each($.proxy(function(dojoContent) {
                        if (dojoContent.get("videoId") === achievement.get("action")) {
                            if (!dojoContent.achievementModels) {
                                dojoContent.achievementModels = [];
                            }
                            dojoContent.achievementModels.push(achievement);
                        }
                    },this));
                },this));
            }

            // ユーザ毎のレコード配列を準備
            var csvRecordArray = [];
            var dojoAchievementCsvModel = new DojoAchievementCsvModel();
            dojoAchievementCsvModel.achievementCollection = this.achievementCollection;
            this.dojoContentCollection.comparator = function(model) {
                return parseInt(model.get("sequence"));
            };
            this.dojoContentCollection.sort();
            dojoAchievementCsvModel.dojoContentCollection = this.dojoContentCollection;
            
            this.personalCollection.each(function(personalModel) {
                var personalCsvObject = dojoAchievementCsvModel.createDojoAchievementCsvData(personalModel);
                csvRecordArray.push(personalCsvObject);
            });
            var csvData = CommonUtil.convertCsvData(csvRecordArray);
            
            // TODO 修正確認用に表示。本来は出力処理を記述
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.alert(csvData);
        },
    });

    module.exports = TopView;
});

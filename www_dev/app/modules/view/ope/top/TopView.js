define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var AbstractView = require("modules/view/AbstractView");
    var OpeNewsView = require("modules/view/ope/news/OpeNewsView");
    var OpeSlideshowListView = require("modules/view/ope/slideshow/OpeSlideshowListView");
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
        newsView : null,
        targetDate : null,

        /**
         * このViewのイベント
         * @memberOf TopView#
         */
        events : {
            "click [data-dojo-achievement-button]" : "onClickDojoAchievementButton",
            "click [data-news-list-button]" : "onClickNewsListButton",
            "click [data-slideshow-list-button]" : "onClickSlideshowListButton"
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
            var self = this;
            // カレンダー表示
            var calendar = this.$el.find("[data-date]");
            var targetDate;
            if (this.targetDate) {
                targetDate = this.targetDate;
            } else {
                var date = new Date();
                targetDate = date.format("%Y-%m-%d");
            }
            this.newsView = new OpeNewsView({targetDate:targetDate});
            calendar.val(targetDate);
            calendar.fcdp({
                fixed : true,
                dateSelector : true,
            });
            calendar.bind('dateChange', function(evt, opts) {
                console.info('dateChange triggered');
                var targetDate = new Date(evt.target.value);
                self.newsView.setDate(targetDate);

                targetDate = targetDate.format("%Y-%m-%d");
                self.targetDate = targetDate;
            });

            // 記事一覧を表示
            this.setView("#opeNewsList", this.newsView).render();
            this.newsView.setDate(this.targetDate ? new Date(this.targetDate) : new Date());
            $("[data-sequence-register-button]").show();
        },
        /**
         * youtubeライブラリを読み込む
         * 
         * @memberOf TopView#
         * @param {Function} callback
         */
        loadYouTubeLibrary : function(callback) {
            this.$progressBar.attr("value", 10);
            if (app.gapiLoaded) {
                callback();
                this.$progressBar.attr("value", 30);
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
                this.$progressBar.attr("value", 30);
                callback(err);
            });
        },
        /**
         * 町民の道場動画達成状況CSVダウンロードボタンを押下された際の処理
         * @memberOf TopView#
         */
        onClickDojoAchievementButton : function() {
            this.showProgressBarLoading();
            this.loadYouTubeLibrary($.proxy(function() {
                // youtubeAPI読み込み
                gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
                gapi.client.load('youtube', 'v3', $.proxy(this.searchDojoCsvInfo, this));
            }, this));
        },
        /**
         * 新聞記事一覧ボタンを押下された際の処理
         * @memberOf TopView#
         */
        onClickNewsListButton : function() {
            var date = this.targetDate || null;
            app.router.go("ope-top", date);
        },
        /**
         * スライドショー画像一覧ボタンを押下された際の処理
         * @memberOf TopView#
         */
        onClickSlideshowListButton : function() {
            this.showLoading();
            $("[data-sequence-register-button]").hide();
            app.router.go("ope-slideshow");
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
                        this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + 10);
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
                        this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + 10);
                        next(null);
                    }.bind(this),
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
            this.personalCollection.condition = {
                    top : 10000
            };
            this.personalCollection.fetch({
                success : function() {
                    this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + 10);
                    callback();
                }.bind(this),
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
                    this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + 20);
                    callback();
                }.bind(this),
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
                this.hideLoading();
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
                    }, this));
                }, this));
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
            this.$progressBar.attr("value", 100);

            // JSONオブジェクトをCSV形式に変換
            var csvObject = CommonUtil.convertCsvData(csvRecordArray);
            this.outputCsv(csvObject);
            this.hideLoading();
        },
        /**
         * CSV出力処理
         * @param {Object} csvObject csv形式のオブジェクト
         * @memberOf TopView#
         */
        outputCsv : function(csvObject) {
            // UTF-8で表示されるようにBOMを付加しておく
            var bom = new Uint8Array([
                    0xEF, 0xBB, 0xBF
            ]);
            var blob = new Blob([
                    bom, csvObject
            ], {
                type : 'text/csv'
            });
            var csvUrl = (window.URL || window.webkitURL).createObjectURL(blob);
            var csvDownloadAnchor = $("<a id='dojoCsvDownload' href='" + csvUrl + "' download='道場達成状況.csv'>");
            $("#contents").append(csvDownloadAnchor);
            csvDownloadAnchor[0].click();
            csvDownloadAnchor.remove();
        }
    });

    module.exports = TopView;
});

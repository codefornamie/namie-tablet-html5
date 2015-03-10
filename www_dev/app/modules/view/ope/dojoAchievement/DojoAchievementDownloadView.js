define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var AbstractView = require("modules/view/AbstractView");
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
     * 道場の達成状況ダウンロード画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場の達成状況ダウンロード画面を表示するためのView
     * @exports DojoAchievementDownloadView
     * @constructor
     */
    var DojoAchievementDownloadView = AbstractView.extend({
        template : require("ldsh!templates/ope/achievement/achievementDownload"),

        /**
         * このViewのイベント
         * @memberOf DojoAchievementDownloadView#
         */
        events : {
            "click [data-dojo-achievement-button]" : "onClickDojoAchievementButton"
        },
        /**
         * youtubeライブラリを読み込む
         * 
         * @memberOf DojoAchievementDownloadView#
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
         * @memberOf DojoAchievementDownloadView#
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
         * 町民の道場動画達成状況CSV用の情報取得
         * @memberOf DojoAchievementDownloadView#
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
         * @memberOf DojoAchievementDownloadView#
         */
        loadDojoContentCollection : function(callback) {
            
            var onYoutubeFetch = function(next) {
                this.youtubeCollection = new YouTubeCollection();
                this.youtubeCollection.channelId = "UCSeFpozPKXTm_frDTqccxpQ";
                this.youtubeCollection.fetch({
                    success : $.proxy(function() {
                        if (this.$progressBar.attr) {
                            this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + 10);
                        }
                        next(null);
                    }, this),
                    error : function error(model, resp, options) {
                        next(resp);
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
                        if (this.$progressBar.attr) {
                            this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + 10);
                        }
                        next(null);
                    }.bind(this),
                    error : function (model, resp, options) {
                        next(resp);
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
         * @memberOf DojoAchievementDownloadView#
         */
        loadPersonalCollection : function(callback) {
            this.personalCollection = new PersonalCollection();
            this.personalCollection.condition = {
                    top : 10000
            };
            this.personalCollection.fetch({
                success : function() {
                    if (this.$progressBar.attr) {
                        this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + 10);
                    }
                    callback();
                }.bind(this),
                error : function (model, resp, options) {
                    callback(resp);
                }
            });
        },
        /**
         * 達成情報の取得
         * @memberOf DojoAchievementDownloadView#
         */
        loadAchievementCollection : function(callback) {
            this.achievementCollection = new AchievementCollection();
            this.achievementCollection.condition.filters = [
                new Equal("type", "dojo_solved")
            ];
            this.achievementCollection.condition.top = 1000000;
            this.achievementCollection.fetch({
                success : function() {
                    if (this.$progressBar.attr) {
                        this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + 20);
                    }
                    callback();
                }.bind(this),
                error : function (model, resp, options) {
                    callback(resp);
                }
            });
        },
        /**
         * 道場動画・パーソナル・達成状況の取得完了後に呼ばれる
         * @memberOf DojoAchievementDownloadView#
         */
        onAllFetch : function(err) {
            if (err) {
                this.hideLoading();
                this.showErrorMessage("道場達成状況情報の取得", err);
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
         * @memberOf DojoAchievementDownloadView#
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

    module.exports = DojoAchievementDownloadView;
});

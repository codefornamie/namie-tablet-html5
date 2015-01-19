define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var AbstractView = require("modules/view/AbstractView");
    var OpeNewsView = require("modules/view/ope/news/OpeNewsView");
    var foundationCalendar = require("foundation-calendar");
    var DateUtil = require("modules/util/DateUtil");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var AchievementCollection = require("modules/collection/misc/AchievementCollection");
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
         * 町民の道場動画達成状況CSVダウンロード処理
         * @memberOf TopView#
         */
        onClickDojoAchievementButton : function() {
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
            this.dojoContentCollection = new DojoContentCollection();
            this.dojoContentCollection.condition.filters = [
                new IsNull("deletedAt")
            ];
            this.dojoContentCollection.fetch({
                success : function() {
                    callback();
                },
                error : function (ev) {
                    callback(ev);
                }
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
         * 道場動画・パーソナル・
         * @memberOf TopView#
         */
        onAllFetch : function(err) {
            if (err) {
                app.logger.error("error OPE:TopView:onAllFetch");
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("道場達成状況情報の取得に失敗しました。");
                return;
            }
        },
    });

    module.exports = TopView;
});

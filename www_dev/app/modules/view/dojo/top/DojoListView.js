define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListItemView = require("modules/view/dojo/top/DojoListItemView");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var FeedListView = require("modules/view/news/FeedListView");
    var Code = require("modules/util/Code");
    var Super = FeedListView;

    /**
     * 道場アプリのコンテンツ一覧を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoListView
     * @constructor
     */
    var DojoListView = FeedListView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoListView#
         */
        template : require("ldsh!templates/{mode}/top/dojoList"),

        /**
         * 記事一覧を表示する要素のセレクタ
         * @memberOf DojoListView#
         */
        listElementSelector : "#dojo-list",

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoListView#
         */
        afterRendered : function() {
            Super.prototype.afterRendered.call(this);
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf DojoListView#
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.dojoEditionModel, "param.dojoEditionModel should be specified");
            console.assert(param.level, "param.level should be specified");

            this.dojoEditionModel = param.dojoEditionModel;
            this.level = param.level;

            // 選択されている級の文字列表現を取得する。この値は、dojo_movie#levelの文字列と同じ
            this.models = this.dojoEditionModel.getModelsByLevel(this.level.get("level"));

            Super.prototype.setFeedListItemViewClass.call(this, DojoListItemView);
        },

        /**
         * 取得した動画一覧を描画する
         * @memberOf DojoListView#
         */
        setFeedList : function() {
            var self = this;
            var animationDeley = 0;

            // 次に見るべき動画とグレーアウトする動画を判断するカウント変数
            var nextCount = 0;
            // 現在表示しようとしている帯画面のレベルまでユーザが達しているかどうかを判断
            if (this.dojoEditionModel.get("contentCollection").getNotAchievementedLevel() < this.level.get("level")) {
                nextCount = 2;
            }

            _(this.models).each($.proxy(function(model) {
                var solvedItem = _.find(model.achievementModels,function(ach){
                    return ach.get("type") === "dojo_" + Code.DOJO_STATUS_SOLVED;
                });

                if (!solvedItem) {
                    nextCount++;
                }

                var ItemView = self.feedListItemViewClass;

                this.insertView(this.listElementSelector, new ItemView({
                    model : model,
                    animationDeley : animationDeley,
                    parentView: this,
                    isNext: nextCount === 1,
                    isGrayedOut: nextCount > 1
                }));

                animationDeley += 0.2;
            }, this));
        }
    });

    module.exports = DojoListView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Code = require("modules/util/Code");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListItemView = require("modules/view/dojo/top/DojoListItemView");

    /**
     * 道場アプリのコース一覧を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのコース一覧を表示するためのView
     * @exports DojoLevelListView
     * @constructor
     */
    var DojoLevelListView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoLevelListView#
         */
        template : require("ldsh!templates/{mode}/top/dojoLevelList"),

        /**
         * テンプレートに渡す情報をシリアライズする
         * @return {Object}
         */
        serialize: function () {
            var self = this;
            var levels = this.extractLevels();

            // 描画用に視聴済み動画の数を計算する
            _(levels).each(function (level) {
                var contents = self.dojoEditionModel.getModelsByLevel(level.id);
                var numWatched = 0;

                level.numContent = contents.length;

                _(contents).each(function (content) {
                    if (content.getWatchedState() === Code.DOJO_STATUS_WATCHED) {
                        numWatched++;
                    }
                });

                level.numWatched = numWatched;
            });

            return {
                levels: levels
            };
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf DojoLevelListView#
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.dojoEditionModel, "param.dojoEditionModel should be specified");
            console.assert(this.collection, "DojoLevelListView should have a collection");

            this.dojoEditionModel = param.dojoEditionModel;

            this.listenTo(this.collection, "achievement", this.onUpdateLevel);
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoLevelListView#
         */
        afterRendered : function() {
            this.updateLevelVisibility();
        },

        /**
         * コースの表示/非表示を切り替える
         * @memberOf DojoLevelListView#
         */
        updateLevelVisibility: function () {
            var notAchievementedLevel = this.collection.getNotAchievementedLevel();
            for (var i = 0, max = parseInt(notAchievementedLevel); i <= max; i++) {
                $("#dojo-level-" + i).show();
            }
        },

        /**
         * コレクション内のモデルの値から級の一覧を作る
         * @memberOf DojoLevelListView#
         */
        extractLevels : function() {
            // 定義されている級のリストを取得する
            // TODO: 将来的には、級の定義情報はperosnium.ioに定義する
            var levels = Code.DOJO_LEVELS;

            return levels;
//            var levels = {};
//            // 級の名称を収集し、重複を削除する
//            var levelValues = this.collection.map(function(model) {
//                return model.get("level");
//            });
//            levelValues = _.uniq(levelValues);
//
//            // 「級の名称=>インデックス」の対応を格納する
//            _.each(levelValues, function(levelValue, index) {
//                levels[levelValue] = index;
//            });
//
//            return levels;
        },

        /**
         * 段位情報が更新されたら呼ばれる
         * @memberOf DojoLevelListView#
         */
        onUpdateLevel: function () {
            this.renderCurrentLevel();
        }
    });

    module.exports = DojoLevelListView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var Code = require("modules/util/Code");
    
    /**
     * ヘッダのViewクラスを作成する。
     * 
     * @class ヘッダのViewクラス
     * @exports HeaderView
     * @constructor
     */
    var HeaderView = AbstractView.extend({
        template : require("ldsh!templates/dojo/top/header"),

        /**
         * Viewの描画処理の後に呼び出されるコールバック関数。
         * @memberOf HeaderView#
         */
        afterRendered : function() {
            this.renderCurrentLevel();
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf HeaderView#
         */
        initialize : function(param) {
            console.assert(param.dojoContentCollection, "param.dojoContentCollection should be specified");

            this.dojoContentCollection = param.dojoContentCollection;

            this.listenTo(this.dojoContentCollection, "achievement", this.onUpdateLevel);
        },

        /**
         * 現在の段位をレンダリングする
         * @memberOf HeaderView#
         */
        renderCurrentLevel: function () {
            var notAchievementedLevel = this.dojoContentCollection.getNotAchievementedLevel();
            var level = Code.DOJO_LEVELS[notAchievementedLevel];

            this.$el.find("#dojo-account__rank-name").text(level.levelName);
            this.$el.find("#dojo-account__rank-icon").attr("data-dojo-level", level.className);
        },

        /**
         * 段位情報が更新されたら呼ばれる
         * @memberOf HeaderView#
         */
        onUpdateLevel: function () {
            this.renderCurrentLevel();
        }
    });

    module.exports = HeaderView;
});

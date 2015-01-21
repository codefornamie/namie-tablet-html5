define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");
    var AchievementModel = require("modules/model/misc/AchievementModel");
    var Code = require("modules/util/Code");

    /**
     * 道場アプリのコース制覇画面のViewクラスを作成する。
     * 
     * @class 道場アプリのコース制覇を表示するためのView
     * @exports DojoLevelCompleteView
     * @constructor
     */
    var DojoLevelCompleteLayout = Backbone.Layout.extend({
        template : require("ldsh!templates/{mode}/top/dojoLevelComplete"),

        /**
         * テンプレートに渡す情報をシリアライズする
         * @memberOf DojoLevelCompleteLayout#
         * @return {Object}
         */
        serialize : function() {
            var nextLevelButtonTitle;

            if (app.currentDojoLevel < this.getMaxDojoLevel() - 1) {
                nextLevelButtonTitle = "次のコースへ進む";
            } else {
                nextLevelButtonTitle = "最初の画面に戻る";
            }

            return {
                dojoLevel: Code.DOJO_LEVELS[this.level.get("level")],
                nextLevelButtonTitle: nextLevelButtonTitle
            };
        },

        /**
         * Layoutの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoLevelCompleteLayout#
         */
        afterRender : function() {
            $('.is-grayedout').unblock(); 

            $(document).trigger("open:modal");
        },
        /**
         * イベント一覧
         * @memberOf DojoLevelCompleteLayout#
         */
        events : {
            "click [data-next-level]" : "onClickNextLevel"
        },

        /**
         * 次のコースへ進むボタンを押したら呼ばれる
         * @memberOf DojoLevelCompleteLayout#
         * @param {Event} ev
         */
        onClickNextLevel : function(ev) {
            ev.preventDefault();

            // 次のコースへ進む。上位レベルがない場合は、トップ画面に戻る
            if (app.currentDojoLevel < this.getMaxDojoLevel() - 1) {
                app.router.go("dojo", "levels", parseInt(app.currentDojoLevel) + 1);
            } else {
                app.router.go("dojo-top");
            }
        },

        /**
         * 初期化
         * @memberOf DojoLevelCompleteLayout#
         * @param {Object} param
         */
        initialize : function(param) {
        },

        /**
         * Viewが破棄された際に呼び出されるコールバック関数。
         * @memberOf DojoLevelCompleteLayout#
         */
        cleanup : function() {
            $(document).trigger("close:modal");
        },

        /**
         * レベルの最高値を取得
         * @memberOf DojoLevelCompleteLayout#
         * @return {Object}
         */
        getMaxDojoLevel : function() {
            var maxDojoLevel = _.max(Code.DOJO_LEVELS, "id");

            return maxDojoLevel ? maxDojoLevel.id : "0";
        }
    }, {
        /**
         * 関連コンテンツのセレクタ
         */
    });

    /**
     * 道場アプリのコース制覇画面のViewクラスを作成する。
     * 
     * @class 道場アプリのコース制覇を表示するためのView
     * @exports DojoLevelCompleteView
     * @constructor
     */
    var DojoLevelCompleteView = AbstractView.extend({
        /**
         * 初期化
         * @memberOf DojoLevelCompleteView#
         * @param {Object} param
         */
        initialize : function(param) {
            this.model = new Backbone.Model();
            this.layout = new DojoLevelCompleteLayout();
            
            this.initEvent();
        },

        /**
         * イベントを初期化する
         * @memberOf DojoLevelView#
         */
        initEvent: function () {
            this.listenTo(this.model, "change:level", this.onChangeLevel);
        },

        /**
         * レベルが変更されたら呼ばれる
         * @param {String} level
         * @memberOf DojoLevelView#
         */
        onChangeLevel: function (level) {
            this.layout.level = level;
        }
    });

    module.exports = DojoLevelCompleteView;
});
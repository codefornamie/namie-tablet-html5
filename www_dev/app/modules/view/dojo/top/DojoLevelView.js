define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListView = require("modules/view/dojo/top/DojoListView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoLevelView
     * @constructor
     */
    var DojoLevelView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoLevelView#
         */
        template : require("ldsh!templates/{mode}/top/dojoLevel"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf DojoLevelView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoLevelView#
         */
        afterRendered : function() {
            if (this.model && this.model.get("contentCollection")) {
                this.updateNumberOfContent(this.model);

                var dojoListView = new DojoListView({
                    collection: this.model.get("contentCollection"),
                    level: this.level
                });

                this.setView("#dojo-list-container", dojoListView).render();
            }
        },

        /**
         * 初期化
         * @param {Object} options 初期化処理オブション情報
         * @memberOf DojoLevelView#
         */
        initialize : function(options) {
//            console.assert(options && (typeof options.level !== "undefined"), 'DojoLevelView should have level option');

//            this.level = options.level;
        },

        /**
         * 道場コンテンツの視聴状況を描画する
         * @param {DojoEditionModel} edition
         * @memberOf DojoLevelView#
         */
        updateNumberOfContent : function(edition) {
            var collection = edition.get("contentCollection");

            this.$el.find("[data-content-num]").text(collection.length);
            this.$el.find("[data-watched-num]").text(edition.getWatchedModels().length);
        }
    });

    module.exports = DojoLevelView;
});

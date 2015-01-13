define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoLevelListView = require("modules/view/dojo/top/DojoLevelListView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoEditionView
     * @constructor
     */
    var DojoEditionView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoEditionView#
         */
        template : require("ldsh!templates/{mode}/top/dojoEdition"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf DojoEditionView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoEditionView#
         */
        afterRendered : function() {
            if (this.model && this.model.get("contentCollection")) {
                this.updateNumberOfContent(this.model);

                var dojoLevelListView = new DojoLevelListView({
                    dojoEditionModel: this.model,
                    collection: this.model.get("contentCollection")
                });

                this.setView("#dojo-level-list-container", dojoLevelListView).render();
            }
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf DojoEditionView#
         */
        initialize : function(param) {
            this.model = new DojoEditionModel();
        },

        /**
         * 道場コンテンツの視聴状況を描画する
         * @param {DojoEditionModel} edition
         * @memberOf DojoEditionView#
         */
        updateNumberOfContent : function(edition) {
            var collection = edition.get("contentCollection");

            this.$el.find("[data-content-num]").text(collection.length);
            this.$el.find("[data-watched-num]").text(edition.getWatchedModels().length);
        }
    });

    module.exports = DojoEditionView;
});

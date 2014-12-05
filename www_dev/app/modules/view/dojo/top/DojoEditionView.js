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
     * @exports DojoEditionView
     * @constructor
     */
    var DojoEditionView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberof DojoEditionView#
         */
        template : require("ldsh!templates/{mode}/top/dojoEdition"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberof DojoEditionView#
         */
        beforeRendered : function() {
            // TODO もっと直感的にアクセスできるようにしたい
            var models = this.model.get("models");
            var edition = models && models[0];

            if (edition) {
                this.model = edition;
            }
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberof DojoEditionView#
         */
        afterRendered : function() {
            if (this.model && this.model.contentCollection) {
                this.updateNumberOfContent(this.model);

                var dojoListView = new DojoListView({
                    collection: this.model.contentCollection
                });

                this.setView("#dojo-list-container", dojoListView).render();
            }
        },

        /**
         * 初期化
         * @memberof DojoEditionView#
         */
        initialize : function() {
            this.model = new DojoEditionModel();
        },

        /**
         * 道場コンテンツの視聴状況を描画する
         * @param {DojoEditionModel} edition
         * @memberof DojoEditionView#
         */
        updateNumberOfContent : function(edition) {
            var collection = edition.contentCollection;

            this.$el.find("[data-content-num]").text(collection.length);
            this.$el.find("[data-watched-num]").text(edition.getWatchedModels().length);
        }
    });

    module.exports = DojoEditionView;
});

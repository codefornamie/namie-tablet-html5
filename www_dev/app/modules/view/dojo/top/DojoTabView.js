define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoTabView
     * @constructor
     */
    var DojoTabView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberof DojoTabView#
         */
        template : require("ldsh!templates/{mode}/top/dojoTab"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberof DojoTabView#
         */
        beforeRendered : function() {
            // TODO もっと直感的にアクセスできるようにしたい
            var models = this.collection.models;
            var model = models && models[0];
            var editions = [];
            var currentEditionIndex = this.collection._currentEditionIndex;

            if (model) {
                editions = model.get("models");
            }

            this.model = new Backbone.Model({
                editions: editions,
                currentEditionIndex: currentEditionIndex
            });
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberof DojoTabView#
         */
        afterRendered : function() {
            this.initEvents();
        },

        /**
         * 初期化
         * @memberof DojoTabView#
         */
        initialize : function() {
            console.assert(this.collection, "DojoTabView should have a collection");
        },

        /**
         * イベントを初期化する
         * @memberof DojoTabView#
         */
        initEvents : function() {
            this.$el.off("click.DojoTabView");
            this.$el.on("click.DojoTabView", "[data-select-edition]", this.onSelectEdition.bind(this));
        },

        /**
         * 編のタブをクリックしたら呼ばれる
         * @param {Event} ev
         */
        onSelectEdition: function (ev) {
            var indexAttr = $(ev.currentTarget).attr("data-select-edition");
            var index = parseInt(indexAttr, 10) || 0;

            this.collection.setEditionIndex(index);
        }
    });

    module.exports = DojoTabView;
});

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
            var currentEditionIndex = 0;

            if (model) {
                editions = model.get("models");
                currentEditionIndex = model.get("_currentEditionIndex");
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
        }
    });

    module.exports = DojoTabView;
});

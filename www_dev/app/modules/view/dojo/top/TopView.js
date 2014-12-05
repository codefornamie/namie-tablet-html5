define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListView = require("modules/view/dojo/top/DojoListView");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports TopView
     * @constructor
     */
    var TopView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberof TopView#
         */
        template : require("ldsh!templates/{mode}/top/top"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberof TopView#
         */
        beforeRendered : function() {

        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberof TopView#
         */
        afterRendered : function() {

        },

        /**
         * 初期化
         * @memberof TopView#
         */
        initialize : function() {
            var dojoContentCollection = this.dojoContentCollection = new DojoContentCollection();

            this.dojoListView = new DojoListView({
                collection : dojoContentCollection
            });
            this.setView("#dojo-list-container", this.dojoListView).render();

            this.setArticleSearchCondition({
                // TODO 実際の検索条件を指定する
                targetDate : new Date(2014, 10, 28)
            });

            this.searchArticles();
            this.initEvents();
        },

        /**
         * イベントを初期化する
         * @memberof TopView#
         */
        initEvents : function() {
            this.listenTo(this.dojoContentCollection, "sync", this.onSyncDojoContent);
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberof TopView#
         */
        setArticleSearchCondition : function(condition) {
            this.dojoContentCollection.setSearchCondition(condition);
        },

        /**
         * 記事の検索処理を開始する。
         * @memberof TopView#
         */
        searchArticles : function() {
            var self = this;

            // ローディングを開始
            this.showLoading();

            // 現在保持しているデータをクリア
            this.dojoContentCollection.reset();

            // データを取得する
            this.dojoContentCollection.fetch({
                success : function() {
                    self.dojoListView.render();
                    self.hideLoading();
                },

                error : function onErrorLoadArticle(e) {
                    console.error(e);
                }
            });
        },

        /**
         * 道場コンテンツが更新されたら呼ばれる
         * @memberof TopView#
         */
        onSyncDojoContent : function() {
            this.$el.find("[data-content-num]").text(this.dojoContentCollection.length);
            this.$el.find("[data-watched-num]").text(this.dojoContentCollection.getWatchedModels().length);
        }
    });

    module.exports = TopView;
});

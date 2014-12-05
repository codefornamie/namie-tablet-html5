define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoTabView = require("modules/view/dojo/top/DojoTabView");
    var DojoEditionView = require("modules/view/dojo/top/DojoEditionView");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var DojoEditionCollection = require("modules/collection/dojo/DojoEditionCollection");

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
            // collectionを初期化する
            this.dojoContentCollection = new DojoContentCollection();
            this.dojoEditionCollection = new DojoEditionCollection();

            // TopViewでDojoContentCollectionの変更を監視して
            // 各子ビュー(DojoTabViewとDojoEditionView)を更新する
            this.dojoTabView = new DojoTabView({
                collection: this.dojoEditionCollection
            });
            this.dojoEditionView = new DojoEditionView();

            // 各子ビューをレンダリングする
            this.setView("#dojo-tab-container", this.dojoTabView).render();
            this.setView("#dojo-edition-container", this.dojoEditionView).render();

            // 道場コンテンツ(this.dojoContentCollection)を取得する
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
            this.listenTo(this.dojoEditionCollection, "edition", this.onChangeEdition);
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} condition 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
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
                    self.hideLoading();
                },

                error : function onErrorLoadArticle(e) {
                    console.error(e);
                }
            });
        },
        
        /**
         * this.dojoEditionCollectionを元に各子ビューを更新する
         */
        updateChildViews: function () {
            // 1. DojoTabViewの更新
            // DojoTabView は thisdojoEditionCollection への参照を保持しているので
            // 自動で更新されるようになっている
            this.dojoTabView.render();

            // 2. DojoEditionViewの更新
            // DojoEditionViewに表示中のModelを更新する
            var currentEditionModel = this.dojoEditionCollection.getCurrentEdition();
            this.dojoEditionView.model.set(currentEditionModel.toJSON());
            this.dojoEditionView.render();
        },

        /**
         * 道場コンテンツが更新されたら呼ばれる
         * @memberof TopView#
         */
        onSyncDojoContent : function() {
            // DojoContentCollection から DojoEditionCollection を生成する
            // DojoEditionCollectionはタブ表示用のcollection
            var editionCollection = this.dojoContentCollection.groupByEditions();
            this.dojoEditionCollection.set(editionCollection);

            this.updateChildViews();
        },

        /**
         * ◯◯編が変更されたら呼ばれる
         */
        onChangeEdition: function () {
            this.updateChildViews();
        }
    });

    module.exports = TopView;
});

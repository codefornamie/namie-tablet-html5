define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var RadMapView = require("modules/view/rad/top/RadMapView");
    var RadClusterListView = require("modules/view/rad/top/RadClusterListView");
    var RadiationClusterModel = require("modules/model/radiation/RadiationClusterModel");
    var RadiationClusterCollection = require("modules/collection/radiation/RadiationClusterCollection");

    /**
     * 放射線アプリのトップ画面を表示するためのViewクラスを作成する。
     *
     * @class 放射線アプリのトップ画面を表示するためのView
     * @exports RadTopView
     * @constructor
     */
    var RadTopView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         */
        template : require("ldsh!templates/{mode}/top/top"),
        events : {
            "click [data-radiation-upload-button]": "onClickRadiationUploadButton",
            "change #radiationFileInput": "onChangeRadiationFile"
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf RadTopView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadTopView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化
         * @memberOf RadTopView#
         */
        initialize : function() {
            // ローディングを開始
            this.showLoading();

            this.initCollection();
            this.initEvents();

            this.setView("#map-container", new RadMapView({
                radiationClusterCollection: this.radClusterCollection
            }));
            this.setView("#contents__secondary .sidebar", new RadClusterListView({
                collection: this.radClusterCollection
            }));

            // ローディングを停止
            this.hideLoading();
        },
        /**
         * 線量データアップロードボタンが押下された際のコールバック
         * @memberOf RadTopView#
         */
        onClickRadiationUploadButton : function() {
            $(this.el).find("#radiationFileInput")[0].click();
        },
        /**
         * 線量データアップロードボタンが押下された際のコールバック
         * @param {Event} ev ファイルイベント
         * @memberOf RadTopView#
         */
        onChangeRadiationFile : function(ev) {
        },

        /**
         * collectionを初期化する
         * @memberOf RadTopView#
         */
        initCollection : function () {
            this.radClusterCollection = new RadiationClusterCollection();

            this.radClusterCollection.fetch();
            // TODO: テスト用データの作成を差し替える
            //_(10).times($.proxy(function(index) {
            //    this.radClusterCollection.push(
            //        new RadiationClusterModel({
            //            __id: "test-content-" + index,
            //            dispTitle: "テスト用コンテンツ" + index
            //        })
            //    );
            //}), this);
        },

        /**
         * イベントを初期化する
         * @memberOf RadTopView#
         */
        initEvents : function() {
            this.listenTo(this.radClusterCollection, "sync", this.render);
        }
    });

    module.exports = RadTopView;
});

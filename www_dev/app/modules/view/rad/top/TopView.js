define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var RadMapView = require("modules/view/rad/top/RadMapView");
    var RadClusterListView = require("modules/view/rad/top/RadClusterListView");
    var RadiationClusterModel = require("modules/model/radiation/RadiationClusterModel");
    var RadiationClusterCollection = require("modules/collection/radiation/RadiationClusterCollection");
    var ModalRadiationListView = require("modules/view/rad/top/ModalRadiationListView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var Code = require("modules/util/Code");
    var vexDialog = require("vexDialog");

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
            "click [data-tab-button]" : "onClickTabButton",
            "click [data-radiation-upload-button]" : "onClickRadiationUploadButton",
            "click [data-toggle-sidebar]" : "toggleSidebar",
            "sidebar.hide" : "hideSidebar",
            "sidebar.show" : "showSidebar"
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf RadTopView#
         */
        beforeRendered : function() {
            this.hideSidebar();
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadTopView#
         */
        afterRendered : function() {
            $(".sidemenu-bottom__scroll")
                .on("scroll", this.onScrollSidebar.bind(this))
                .trigger("scroll");
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
            //this.hideLoading();
        },
        /**
         * タブ切り替えボタンが押下された際のコールバック
         * @memberOf RadTopView#
         * @param {Event} ev
         */
        onClickTabButton : function(ev) {
            var $tab = $(".contents__secondary .sidemenu .tab");
            var selectedTabName = $(ev.target).data("tab");

            $(".tab-button", $tab).removeClass("tab-button--selected");
            $(".tab-button--" + selectedTabName, $tab).addClass("tab-button--selected");
            $("#contents__secondary").attr("data-selected-tab", selectedTabName);

            $(".sidemenu-bottom__scroll").scrollTop(0);

            this.radClusterCollection.trigger("tabSwitched", selectedTabName);
        },
        /**
         * 線量データアップロードボタンが押下された際のコールバック
         * @memberOf RadTopView#
         */
        onClickRadiationUploadButton : function() {
            if (!!~navigator.userAgent.indexOf("namie-debug")) {
                // XXX: dummy
                this.setRadiationList([
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()},
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()},
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()},
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()},
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()},
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()},
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()},
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()},
                    {name: "dummy" + Math.random(), lastModifiedDate: new Date()}
                ]);
            } else if (CommonUtil.isCordova()) {
                this.showLoading();
                FileAPIUtil.getHoribaRadiationList(this.setRadiationList.bind(this));
            } else {
                alert("ご使用の端末ではアップロードできません。");
                return;
            }
        },
        /**
         * 画面に線量データ一覧を表示する関数
         * @param {Array} fileEntryArray FileEntryオブジェクトの配列
         * @memberOf RadTopView#
         */
        setRadiationList : function(fileEntryArray) {
            var urls = [];
            var fileCount = 0;
            if (!fileEntryArray || fileEntryArray.length === 0) {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("放射線量データがありません。");
                this.hideLoading();
                return;
            }
            var modalRadiationListView = new ModalRadiationListView();
            modalRadiationListView.fileEntryArray = fileEntryArray;

            this.setView("#radiation-list-container", modalRadiationListView);
            this.listenTo(modalRadiationListView, "closeModalRadiationList", function () {
                modalRadiationListView.remove();
                // URLを元に戻す
                app.router.back();
            });
            modalRadiationListView.render();

            // カレンダー画面用URLに遷移
            app.router.navigate("radiationList", {
                trigger: true,
                replace: false
            });
            this.hideLoading();
        },

        /**
         * collectionを初期化する
         * @memberOf RadTopView#
         */
        initCollection : function () {
            this.radClusterCollection = new RadiationClusterCollection();
            // 車載または自身がアップロードしたデータのみ検索
            this.radClusterCollection.setSearchConditionFixedOrByMyself();
            this.radClusterCollection
                .fetch()
                .done(function (col) {
                    if (col.size() === 0) {
                        return;
                    }
                    col.each(function (model) {
                        model.set("hidden", true);
                    });

                    // 車載の情報のうち先頭の1件を表示
                    var firstFixedClusterModel = col.find(function (model) {
                        return model.get("isFixedStation");
                    });
                    if (firstFixedClusterModel) {
                        firstFixedClusterModel.set("hidden", false);
                    }

                    // タブを「役場」に切り替える
                    $(".tab-button--fixed").click();
                });
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
            this.listenTo(this.radClusterCollection, "clusterListUpdated", this.onClusterListUpdated.bind(this));
        },

        /**
         * サイドバーを表示する
         * @memberOf RadTopView#
         */
        showSidebar : function () {
            $("#snap-content").removeClass("is-expanded");
            $(window).triggerHandler("resize");
        },

        /**
         * サイドバーを非表示にする
         * @memberOf RadTopView#
         */
        hideSidebar : function () {
            $("#snap-content").addClass("is-expanded");
            $(window).triggerHandler("resize");
        },

        /**
         * サイドバーの表示/非表示を切り替える
         * @memberOf RadTopView#
         */
        toggleSidebar : function () {
            $("#snap-content").toggleClass("is-expanded");
            $(window).triggerHandler("resize");
        },

        /**
         * サイドバーがスクロールされたら呼ばれる
         * @memberOf RadTopView#
         * @param {Event} ev
         */
        onScrollSidebar : _.throttle(function (ev) {
            var el = ev.currentTarget;
            var $container = $(el);
            var scrollTop = $container.scrollTop();
            var containerHeight = $container.height();
            var contentHeight = $container[0].scrollHeight;

            if (scrollTop > 0) {
                $container.addClass("has-before");
            } else {
                $container.removeClass("has-before");
            }

            if (containerHeight + scrollTop < contentHeight) {
                $container.addClass("has-after");
            } else {
                $container.removeClass("has-after");
            }
        }, 150),

        /**
         * サイドバーのクラスター一覧の更新後に呼ばれる
         * @memberOf RadTopView#
         * @param {Event} ev
         */
        onClusterListUpdated : function () {
            $(".sidemenu-bottom__scroll").trigger("scroll");
        }
    });

    module.exports = RadTopView;
});

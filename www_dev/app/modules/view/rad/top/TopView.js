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
         * 線量データアップロードボタンが押下された際のコールバック
         * @memberOf RadTopView#
         */
        onClickRadiationUploadButton : function() {
            var self = this;

            this.showLoading();

            // Cordova環境下ならば、HORIBAのディレクトリから自動でファイルをリストアップする
            // それ以外の環境ならば、ファイル選択のフォームを表示する
            if (CommonUtil.isCordova()) {
                this.loadHoribaRadiationList(function (err, fileEntryArray) {
                    if (err) {
                        app.logger.debug("ModalRadiationListView#onClickRadiationUploadButton():" + err);
                        self.hideLoading();
                        return;
                    }

                    self.initModalRadiationListView({
                        mode : "list",
                        fileEntryArray : fileEntryArray
                    });

                    self.hideLoading();
                });
            } else {
                this.initModalRadiationListView({
                    mode : "form"
                });

                this.hideLoading();
            }
        },

        /**
         * getHoribaRadiationList
         * @param {Function} next errorを第一引数にとるコールバック関数
         * @memberOf RadTopView#
         */
        loadHoribaRadiationList : function (next) {
            FileAPIUtil.getHoribaRadiationList(function (fileEntryArray) {
                if (!fileEntryArray || fileEntryArray.length === 0) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("放射線量データがありません。");
                    return next(new Error("radiation data not found"));
                }

                next(null, fileEntryArray);
            });
        },

        /**
         * 画面に線量データ一覧を表示する関数
         * @param {Object} opt ModalRadiationListViewのコンストラクタに渡すオプション
         * @memberOf RadTopView#
         */
        initModalRadiationListView : function(opt) {
            var modalRadiationListView = new ModalRadiationListView(opt);

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
            // 自身のアップロードしたデータのみ検索
            this.radClusterCollection.setSearchConditionByMyself();
            this.radClusterCollection
                .fetch()
                .done(function (col) {
                    if (col.size() === 0) {
                        return;
                    }
                    col.each(function (model) {
                        model.set("hidden", true);
                    });
                    col.at(0).set("hidden", false);
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
        }, 150)
    });

    module.exports = RadTopView;
});

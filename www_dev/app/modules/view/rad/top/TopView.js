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
            "sidebar.show" : "showSidebar",
            "click #radiation-scrollDown" : "scrollDown"
        },

        /**
         * リストのスクロールオーバーレイ（上）が表示されているかどうか
         */
        isShowScrollUp : true,
        
        /**
         * リストのスクロールオーバーレイ（下）が表示されているかどうか
         */
        isShowScrollDown : true,
        
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
                .on("scroll", this.onScrollSidebar.bind(this));
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
            $(".sidemenu-bottom__scroll").trigger("scroll");
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
                    $(".sidemenu-bottom__scroll").trigger("scroll");
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
        onScrollSidebar : _.throttle(function(ev) {
            var el = ev.currentTarget;
            var $container = $(el);
            var scrollTop = $container.scrollTop();
            var containerHeight = $container.height();
            var contentHeight = $container[0].scrollHeight;

            if (scrollTop > 0) {
                if(!this.isShowScrollUp){
                    this.isShowScrollUp = true;
                    $("#radiation-scrollUp").animate({
                        height : "50px",
                        opacity : 1
                    });
                }
            } else {
                if(this.isShowScrollUp){
                    this.isShowScrollUp = false;
                    $("#radiation-scrollUp").animate({
                        height : 0,
                        opacity : 0
                    });
                }
            }

            if (scrollTop < contentHeight - containerHeight) {
                if(!this.isShowScrolldown){
                    this.isShowScrolldown = true;
                    $("#radiation-scrollDown").animate({
                        height : "50px",
                        opacity : 1
                    });
                }
            } else {
                if(this.isShowScrolldown){
                    this.isShowScrolldown = false;
                    $("#radiation-scrollDown").animate({
                        height : 0,
                        opacity : 0
                    });
                }
            }
        }, 150),

        /**
         * スクロールバー（下）が押されたら呼ばれる
         * @memberOf RadTopView#
         * @param {Event} ev
         */
        scrollDown : function(ev) {
            var $target = $(".sidemenu-bottom__scroll");
            var outerHeight = $(".rad-cluster-item").outerHeight();
            var scrollTop = $target.scrollTop();
            $target.animate({scrollTop : scrollTop + outerHeight});
        }
    });

    module.exports = RadTopView;
});

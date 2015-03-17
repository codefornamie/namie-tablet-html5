define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var AbstractView = require("modules/view/AbstractView");
    var RadMapView = require("modules/view/rad/top/RadMapView");
    var RadClusterListView = require("modules/view/rad/top/RadClusterListView");
    var RadiationClusterModel = require("modules/model/radiation/RadiationClusterModel");
    var RadiationClusterCollection = require("modules/collection/radiation/RadiationClusterCollection");
    var ModalRadiationListView = require("modules/view/rad/top/ModalRadiationListView");
    var RadTutorialView = require("modules/view/rad/top/RadTutorialView");
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
            "sidebar.show" : "showSidebar",
            "click #radiation-scrollDown" : "scrollDown",
            "click #radiation-scrollUp" : "scrollUp",
            "click [data-tutorial-button]" : "onClickTutorialButton"
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
            $("#radiation-scrollDown").css("opacity",0);
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

            this.loadYouTubeLibrary($.proxy(function(err) {
                if (!CommonUtil.isOnline()) {
                    err = "Network is Offline";
                }
                if (err) {
                    app.logger.info("Failed loading youtube library. error:" + err);
                    this.showMessage("Youtubeライブラリの読み込みに失敗しました。通信状態をご確認ください。");
                    this.hideLoading();
                } else {
                    // youtubeAPI読み込み
                    gapi.client.setApiKey("AIzaSyCfqTHIGvjra1cyftOuCP9-UGZcT9YkfqU");
                    //gapi.client.load('youtube', 'v3', $.proxy(this.searchDojoMovieList, this));
                }

            }, this));
        },

        /**
         * youtubeライブラリを読み込む
         * 
         * @memberOf RadTopView#
         * @param {Function} callback
         */
        loadYouTubeLibrary : function(callback) {
            if (app.gapiLoaded) {
                callback();
                return;
            }
            var self = this;
            var loadScript = function(url) {
                return function(next) {
                    $.getScript(url).done(function() {
                        next(null);
                    }).fail(function(jqXHR, settings, err) {
                        next(err);
                    });
                };
            };
            var onLoadGAPI = function(next) {
                window.onLoadGAPI = function() {
                    delete window.onLoadGAPI;
                    next(null);
                };

                loadScript("https://apis.google.com/js/client.js?onload=onLoadGAPI")(function(err) {
                    if (err) {
                        next(err);
                        return;
                    }
                });
            };
            async.series([
                    onLoadGAPI, loadScript("https://www.youtube.com/iframe_api")
            ], function(err) {
                if (!err) {
                    app.gapiLoaded = true;
                }
                callback(err);
            });
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

            // 線量データ一覧画面用URLに遷移
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
            this.radClusterCollection.setSearchConditionByMunicipalityOrByMyself();
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

                    // 車載の情報のうち先頭の1件を表示
                    var firstMunicipalityClusterModel = col.find(function (model) {
                        return model.get("measurementType") === Code.RAD_MEASUREMENT_MUNICIPALITY;
                    });
                    if (firstMunicipalityClusterModel) {
                        firstMunicipalityClusterModel.set("hidden", false);
                    }

                    // タブを「役場」に切り替える
                    $(".tab-button--municipality").click();
                });
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
        onScrollSidebar : _.throttle(function(ev) {
            var el = ev.currentTarget;
            var $container = $(el);
            var scrollTop = $container.scrollTop();
            var containerHeight = $container.height();
            var contentHeight = $container[0].scrollHeight;

            if (scrollTop > 0) {
                if (!this.isShowScrollUp) {
                    this.isShowScrollUp = true;
                    $(this).css("z-index", 10);
                    $("#radiation-scrollUp").animate({
                        opacity : 1
                    });
                }
            } else {
                if (this.isShowScrollUp) {
                    this.isShowScrollUp = false;
                    $(this).css("z-index", 0);
                    $("#radiation-scrollUp").animate({
                        opacity : 0
                    });
                }
            }

            if (scrollTop < contentHeight - containerHeight) {
                if (!this.isShowScrolldown) {
                    this.isShowScrolldown = true;
                    $(this).css("z-index", 10);
                    $("#radiation-scrollDown").animate({
                        opacity : 1
                    });
                }
            } else {
                if (this.isShowScrolldown) {
                    this.isShowScrolldown = false;
                    $(this).css("z-index", 0);
                    $("#radiation-scrollDown").animate({
                        opacity : 0
                    });
                }
            }
        }, 150),

        /**
         * サイドバーのクラスター一覧の更新後に呼ばれる
         * @memberOf RadTopView#
         * @param {Event} ev
         */
        onClusterListUpdated : function () {
            this.isShowScrollUp = true;
            $(".sidemenu-bottom__scroll").trigger("scroll");
        },

        /**
         * スクロールバー（下）が押されたら呼ばれる
         * @memberOf RadTopView#
         * @param {Event} ev
         */
        scrollDown : _.throttle(function(ev) {
            var $target = $(".sidemenu-bottom__scroll");
            var outerHeight = $(".rad-cluster-item").outerHeight();
            var marginTop = parseInt($(".rad-cluster-item").css("margin-top"));
            var scrollTop = $target.scrollTop();
            $target.animate({
                scrollTop : scrollTop + outerHeight + marginTop
            }, 300);
        }, 500),

        /**
         * スクロールバー（上）が押されたら呼ばれる
         * @memberOf RadTopView#
         * @param {Event} ev
         */
        scrollUp : _.throttle(function(ev) {
            var $target = $(".sidemenu-bottom__scroll");
            var outerHeight = $(".rad-cluster-item").outerHeight();
            var marginTop = parseInt($(".rad-cluster-item").css("margin-top"));
            var scrollTop = $target.scrollTop();
            $target.animate({
                scrollTop : scrollTop - outerHeight - marginTop
            }, 300);
        }, 500),

        /**
         * 使い方ボタンが押下された際のコールバック
         * @memberOf RadTopView#
         */
        onClickTutorialButton : function() {
            var radTutorialView = new RadTutorialView();

            this.setView("#radiation-tutorial-container", radTutorialView);
            radTutorialView.render();
        }
    });

    module.exports = RadTopView;
});

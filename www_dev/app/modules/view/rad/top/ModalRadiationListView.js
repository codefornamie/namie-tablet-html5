define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ModalRadiationListItemView = require("modules/view/rad/top/ModalRadiationListItemView");


    /**
     * 線量データのアップロード用リストダイアログクラス
     * @class 線量データのアップロード用リストダイアログクラス
     * @exports ModalRadiationListView
     * @constructor
     */
    var ModalRadiationListView = AbstractView.extend({
        /**
         * テンプレート
         * @memberOf ModalRadiationListView#
         */
        template : require("ldsh!templates/rad/top/modal-radiationList"),
        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 線量データ一覧の表示処理を開始する。
         * </p>
         * @memberOf ModalRadiationListView#
         */
        beforeRendered : function() {
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf ModalRadiationListView#
         */
        afterRendered : function() {
            if (this.radiationList) {
                this.radiationList.destroy();
            }
            this.setRadiationList();
            this.hideLoading();

            $(document).trigger("open:modal");
        },
        /**
         * イベント
         * @memberOf ModalRadiationListView#
         */
        events : {
            "click #modal-calendar-overlay" : "onClickOverlay",
            "click [data-close]" : "onClickCloser"
        },
        /**
         * 線量データ一覧の表示処理
         * @memberOf ModalRadiationListView#
         */
        setRadiationList : function() {
            _.each(this.fileEntryArray, $.proxy(function(fileEntry) {
                this.insertView("#radiationList", new ModalRadiationListItemView({
                    fileEntry : fileEntry,
                    parentView : this
                })).render();
            }, this));
        },

        /**
         * Viewが破棄される時に呼ばれる
         * @memberOf ModalRadiationListView#
         */
        cleanup : function () {
            if (this.radiationList) {
                this.radiationList.destroy();
            }

            $(document).trigger("close:modal");
        },

        /**
         * オーバレイをクリックした時に呼ばれる
         * @memberOf ModalRadiationListView#
         * @param {Event} ev
         */
        onClickOverlay : function (ev) {
            // オーバーレイの背景部分をタップした場合のみ処理する
            if (!$(ev.target).is("#modal-radiation-overlay")) {
                return;
            }

            this.trigger("closeModalRadiationList");
        },

        /**
         * 閉じるボタンをクリックした時に呼ばれる
         * @memberOf ModalRadiationListView#
         * @param {Event} ev
         */
        onClickCloser : function (ev) {
            this.trigger("closeModalRadiationList");
        },
    });

    module.exports = ModalRadiationListView;
});

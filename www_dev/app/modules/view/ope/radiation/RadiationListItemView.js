define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var vexDialog = require("vexDialog");
    var async = require("async");

    var WebDavModel = require("modules/model/WebDavModel");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 車載線量データ画面一覧アイテムのViewクラス
     * @class 車載線量データ画面一覧アイテムのViewクラス
     * @exports OpeSlideshowListItemView
     * @constructor
     */
    var RadiationListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/radiation/radiationListItem"),

        /**
         * レンダリングに利用するオブジェクトを作成する
         *
         * @return {Object}
         */
        serialize : function () {
            var prop = this.model.toGeoJSON().properties;
//            var m = moment(prop.startDate);
//            var isInvalid = !m.isValid();
//            var generateKeyFormatPair = function (key) {
//                return [key, isInvalid ? "--" : m.format(key)];
//            };
//
//            var date = _(["YYYY", "M", "D", "ddd","HH","mm","ss"])
//                .map(generateKeyFormatPair)
//                .object()
//                .value();
            var sDate = this.toMapDate(prop.startDate);
            var eDate = this.toMapDate(prop.endDate);
            return {
                model : this.model,
                prop : prop,
                hasError : !!this.model.get("errorCode"),
                sDate : sDate,
                eDate : eDate
            };
        },
        toMapDate : function (d) {
            var mDate = moment(d);
            var isInvalid = !mDate.isValid();
            var generateKeyFormatPair = function (key) {
                return [key, isInvalid ? "--" : mDate.format(key)];
            }
            
            return _(["YYYY", "MM", "DD", "ddd", "HH", "mm", "ss"])
            .map(generateKeyFormatPair)
            .object()
            .value();
        },
        /**
         * このViewの親要素
         * @memberOf OpeSlideshowListItemView#
         */
        tagName : "tr",
        /**
         * このViewのイベント
         * @memberOf OpeSlideshowListItemView#
         */
        events : {
            "click [data-article-edit-button]" : "onClickRadiationDeleteButton"
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlideshowListItemView#
         */
        beforeRendered : function() {
        },

        /**
         * 初期化処理
         * @memberOf OpeSlideshowListItemView#
         */
        initialize : function(options) {
        },
        /**
         * 削除ボタンをクリックした後に呼ばれる
         * @memberOf RadClusterListItemView#
         */
        onClickRadiationDeleteButton : function () {
            destroyModel();
        },

        /**
         * ODataの削除
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        destroyModel : function() {
            alert("データ消します");
            // ODataの削除
//            this.model.destroy({
//                success : $.proxy(function() {
//                    app.logger.debug("destroyModel():success");
//                }, this),
//                error : $.proxy(function(e) {
//                    this.hideLoading();
//                    vexDialog.alert("削除に失敗しました。");
//                    app.logger.error("削除に失敗しました。");
//                }, this)
//            });
        }
    });
    module.exports = RadiationListItemView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var Code = require("modules/util/Code");
    var AbstractView = require("modules/view/AbstractView");
    var Super = AbstractView;

    /**
     * 放射線アプリのクラスター項目を表示するためのViewクラスを作成する。
     * 
     * @class 放射線アプリのクラスター項目を表示するためのView
     * @exports RadClusterListItemView
     * @constructor
     */
    var RadClusterListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/radClusterListItem"),

        /**
         * レンダリングに利用するオブジェクトを作成する
         *
         * @return {Object}
         */
        serialize : function () {
            var prop = this.model.toGeoJSON().properties;
            var m = moment(prop.startDate);
            var m2 = moment(prop.endDate);
            var isInvalid = !m.isValid();
            var generateKeyFormatPair = function (key) {
                return [key, isInvalid ? "--" : m.format(key)];
            };

            var date = _(["YYYY", "M", "D", "ddd"])
                .map(generateKeyFormatPair)
                .object()
                .value();

            var startTime = m.isValid() ? m.format("HH:mm") : "--";
            var endTime = m2.isValid() ? m2.format("HH:mm") : "--";

            var errorCode = this.model.get("errorCode");
            var hasErrDoseMissing = errorCode & Code.ERR_DOSE_MISSING;
            var hasErrPositionMissing = errorCode & Code.ERR_POSITION_MISSING;
            var hasErrInvalidDate = errorCode & Code.ERR_INALID_DATE;
            var hasError = !!errorCode;

            return {
                model : this.model,
                prop : prop,
                date : date,
                startTime : startTime,
                endTime : endTime,
                hasErrDoseMissing : hasErrDoseMissing,
                hasErrPositionMissing : hasErrPositionMissing,
                hasErrInvalidDate : hasErrInvalidDate,
                hasError : hasError
            };
        },

        /**
         * イベント
         * @memberOf RadClusterListItemView#
         */
        events : {
            "click" : "onClickClusterItem"
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * @memberOf RadClusterListItemView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadClusterListItemView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化
         * @memberOf RadClusterListItemView#
         */
        initialize : function() {
            this.initEvents();
        },

        /**
         * イベントを初期化する
         * @memberOf RadClusterListItemView#
         */
        initEvents : function() {
            this.listenTo(this.model, "change:hidden", this.onChangeClusterModel);
        },

        /**
         * リストのアイテムをクリックした後に呼ばれる
         * @memberOf RadClusterListItemView#
         */
        onClickClusterItem : function () {
            var radClusterModel = this.model;
            var isHidden = !!radClusterModel.get("hidden");

            radClusterModel.set("hidden", !isHidden);
        },

        /**
         * ClusterModelが表示されたら、クラスを変更する
         * @memberOf RadClusterListItemView#
         * @param {RadiationClusterModel} model
         */
        onChangeClusterModel : function (model) {
            if (model.get("hidden")) {
                $("> li", this.$el).removeClass("rad-cluster-item--selected");
            } else {
                $("> li", this.$el).addClass("rad-cluster-item--selected");
            }
        }
    });

    module.exports = RadClusterListItemView;
});

/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
            var hasErrInvalidDate = errorCode & Code.ERR_INVALID_DATE;
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

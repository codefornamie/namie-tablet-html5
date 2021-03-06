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
    var vexDialog = require("vexDialog");
    var Code = require("modules/util/Code");
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
         * @return {Object}
         * @memberOf RadiationListItemView#
         */
        serialize : function() {
            var prop = this.model.toGeoJSON().properties;
            var sDate = this.toMapDate(prop.startDate);
            var eDate = this.toMapDate(prop.endDate);

            var errorCode = this.model.get("errorCode");
            var hasErrDoseMissing = errorCode & Code.ERR_DOSE_MISSING;
            var hasErrPositionMissing = errorCode & Code.ERR_POSITION_MISSING;
            var hasErrInvalidDate = errorCode & Code.ERR_INVALID_DATE;
            var hasError = !!errorCode;

            return {
                model : this.model,
                prop : prop,
                sDate : sDate,
                eDate : eDate,
                hasErrDoseMissing : hasErrDoseMissing,
                hasErrPositionMissing : hasErrPositionMissing,
                hasErrInvalidDate : hasErrInvalidDate,
                hasError : hasError
            };
        },

        /**
         * 日付をマップに変換する
         * @param {String} 日付文字列
         * @return {Object} 各日付フィールドを格納したマップ
         * @memberOf RadiationListItemView#
         */
        toMapDate : function(d) {
            var mDate = moment(d);
            var isInvalid = !mDate.isValid();
            var generateKeyFormatPair = function(key) {
                return [
                        key, isInvalid ? "--" : mDate.format(key)
                ];
            };

            return _([
                    "YYYY", "MM", "DD", "ddd", "HH", "mm", "ss"
            ]).map(generateKeyFormatPair).object().value();
        },
        /**
         * このViewの親要素
         * @memberOf RadiationListItemView#
         */
        tagName : "tr",
        /**
         * このViewのイベント
         * @memberOf RadiationListItemView#
         */
        events : {
            "click [data-article-edit-button]" : "onClickRadiationDeleteButton"
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf RadiationListItemView#
         */
        beforeRendered : function() {
        },

        /**
         * 初期化処理
         * @memberOf RadiationListItemView#
         */
        initialize : function(options) {
        },

        /**
         * 削除ボタンをクリックした後に呼ばれる
         * @memberOf RadiationListItemView#
         */
        onClickRadiationDeleteButton : function() {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = 'はい';
            vexDialog.buttons.NO.text = 'いいえ';
            vexDialog.open({
                message : '選択した線量計データを削除していいですか？',
                callback : $.proxy(function(value) {
                    if (value) {
                        this.showLoading();

                        this.model.set("isDelete", true);
                        this.model.save(null, {
                            success : $.proxy(function(model, resp, options) {
                                this.hideLoading();
                                this.showSuccessMessage("線量計データ情報の削除", model);
                                app.router.opeRadiation();
                            }, this),
                            error : $.proxy(function(model, resp, options) {
                                this.hideLoading();
                                this.showErrorMessage("線量計データ情報の削除", resp);
                                app.router.opeRadiation();
                            }, this)
                        });
                    }
                    return;
                }, this)
            });
        }
    });
    module.exports = RadiationListItemView;
});

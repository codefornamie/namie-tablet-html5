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
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var CommonUtil = require("modules/util/CommonUtil");

    /**
     * キャラクターメッセージ情報のモデルクラスを作成する。
     * 
     * @class キャラクターメッセージ情報のモデルクラス
     * @exports CharacterMessageModel#
     * @constructor
     */
    var CharacterMessageModel = AbstractODataModel.extend({
        /**
         * このモデルに対応するEntitySet名
         * @memberOf CharacterMessageModel#
         */
        entity : "character_message",
        /**
         * 取得したOData情報のparse処理を行う。
         * <p>
         * character_messageのプロパティをView表示用データに変換する
         * </p>
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf CharacterMessageModel#
         */
        parseOData : function(response, options) {
            switch (response.type) {
            case 1:
                response.dispType = "通常";
                break;
            case 2:
                response.dispType = "おすすめ記事";
                break;
            default:
                response.dispType = "通常";
                break;
            }
            response.message = this.getAndReplaceBrElement(response.message);

            return response;
        },
        /**
         * 画面表示用のメッセージの文字列を取得する。
         * <p>
         * 画面表示用のためのサニタイジングされた文字列を返却する。
         * </p>
         * @return {String} メッセージ
         */
        getDisplayMessage: function() {
            return CommonUtil.sanitizing(this.get("message"));
        },
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * キャラクターメッセージ固有の情報を保存する処理を行う。
         * </p>
         * @param {Object} saveData 永続化データ
         * @memberOf CharacterMessageModel#
         */
        makeSaveData : function(saveData) {
            saveData.type = this.get("type");
            saveData.message = this.getAndReplaceLineBreaks("message");
            saveData.weight = this.get("weight");
            saveData.enabled = this.get("enabled");
        },
        /**
         * このモデルの文字列情報を取得する
         * @memberOf CharacterMessageModel#
         * @return {String} このモデルの文字列情報
         */
        toString : function() {
            return "CharacterMessageModel [type:" + this.get("type") + ", message:" + this.get("message") +
                    ", weight:" + this.get("weight") + ", enabled:" + this.get("enabled") + "]";
        }
    });

    module.exports = CharacterMessageModel;
});

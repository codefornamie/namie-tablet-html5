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
    var DateUtil = require("modules/util/DateUtil");
    /**
     * スライドショー情報のモデルクラスを作成する。
     * 
     * @class スライドショー情報のモデルクラス
     * @exports SlideshowModel
     * @constructor
     */
    var SlideshowModel = AbstractODataModel.extend({
        entity : "slideshow",
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、 永続化するデータを生成する処理を実装する。
         * </p>
         * @param {Object} saveData 永続化データ
         * @memberOf SlideshowModel#
         */
        makeSaveData : function(saveData) {
            saveData.filename = this.get("filename");
            saveData.published = this.get("published");
            saveData.publishedAt = this.get("publishedAt");
            saveData.depublishedAt = this.get("depublishedAt");
        },
        /**
         * このモデルの文字列情報を取得する
         * @memberOf SlideshowModel#
         * @return {String} このモデルの文字列情報
         */
        toString : function() {
            return "SlideshowModel [filename:" + this.get("filename") + ", published:" + this.get("published") +
                    ", publishedAt:" + this.get("publishedAt") + ", depublishedAt:" + this.get("depublishedAt") + "]";
        }
    });

    module.exports = SlideshowModel;
});

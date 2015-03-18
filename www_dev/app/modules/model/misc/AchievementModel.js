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
    var AbstractUserScriptModel = require("modules/model/AbstractUserScriptModel");

    /**
     * 達成情報のモデルクラスを作成する。
     * 
     * @class 達成情報のモデルクラス
     * @exports AchievementModel
     * @constructor
     */
    var AchievementModel = AbstractUserScriptModel.extend({
        serviceName: 'achievement',
        entity : "achievement",
        /**
         * 取得したOData情報のparse処理を行う。
         * 
         * @memberOf AchievementModel#
         * @param {Object} レスポンス
         * @param {Object} オプション
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * 
         * @param {Object} saveData 保存データ
         * @memberOf AchievementModel#
         */
        makeSaveData : function(saveData) {
            saveData.userId = app.user.get("__id");
            // TODO 現在のところ0固定。同世帯内の人物を区別したい要望が来た場合に正しく実装
            saveData.memberId = "0";
            saveData.type = this.get("type");
            saveData.action = this.get("action");
            saveData.count = this.get("count");
            saveData.lastActionDate = this.get("lastActionDate");
        },
    });

    module.exports = AchievementModel;
});
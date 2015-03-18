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
    var Code = require("modules/util/Code");
    var AbstractModel = require("modules/model/AbstractModel");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");

    /**
     * 道場達成状況CSVのモデルクラスを作成する。
     * 
     * @class 道場達成状況CSVのモデルクラス
     * @exports DojoAchievementCsvModel
     * @constructor
     */
    var DojoAchievementCsvModel = AbstractModel.extend({
        /**
         * 道場動画コレクション
         * @memberOf DojoAchievementCsvModel#
         */
        dojoContentCollection : null,
        /**
         * 達成状況コレクション
         * @memberOf DojoAchievementCsvModel#
         */
        achievementCollection : null,
        /**
         * 道場達成状況CSVに出力する習得ラベル
         * @memberOf DojoAchievementCsvModel#
         */
        DOJO_CSV_SOLVED_LABEL : "習得済",
        /**
         * 道場達成状況CSVに出力する視聴ラベル
         * @memberOf DojoAchievementCsvModel#
         */
        DOJO_CSV_WATCH_LABEL : "視聴済",
        /**
         * 道場達成状況CSVに出力する未視聴ラベル
         * @memberOf DojoAchievementCsvModel#
         */
        DOJO_CSV_UNWATCH_LABEL : "未視聴",

        /**
         * パーソナル情報から、当該ユーザの道場達成状況CSVを1レコード生成
         * @param {Model} personalModel
         * @memberOf DojoAchievementCsvModel#
         */
        createDojoAchievementCsvData : function(personalModel) {
            if (!this.dojoContentCollection || !this.achievementCollection) {
                app.logger.debug("this method needs dojoContentCollection,achievementCollection");
                return;
            }
            var csvObject = {};
            this.personalModel = personalModel;
            csvObject["ログインID"] = personalModel.get("loginId");
            this.dojoContentCollection.each(function(dojoModel) {
                var csvTitleLabel = this.getCsvTitleLabel(dojoModel);
                var csvAchievementLabel = this.getCsvAchievementLabel(dojoModel);
                csvObject[csvTitleLabel] = csvAchievementLabel;
            }.bind(this));
            return csvObject;
        },
        /**
         * 道場モデルからCSVタイトル用のラベルを生成
         * @param {Model} dojoModel
         * @memberOf DojoAchievementCsvModel#
         */
        getCsvTitleLabel : function(dojoModel) {
            var levelObject = Code.DOJO_LEVELS[dojoModel.get("level")];
            var levelLabel = "";
            if (levelObject) {
                levelLabel = levelObject.label + "：";
            }
            return levelLabel + dojoModel.get("title");
        },
        /**
         * 道場モデルから当該ユーザのCSV達成状況値用のラベルを生成
         * @param {Model} dojoModel
         * @memberOf DojoAchievementCsvModel#
         */
        getCsvAchievementLabel : function(dojoModel) {
            var myDojoModel = $.extend(true, {}, dojoModel);
            // 当該ユーザのみの達成状況に絞る
            myDojoModel.achievementModels = _.filter(dojoModel.achievementModels, function(model) {
                return model.get("userId") === this.personalModel.get("__id");
            }.bind(this));
            var solveStatus = myDojoModel.getSolvedState();
            if (solveStatus === Code.DOJO_STATUS_SOLVED) {
                return this.DOJO_CSV_SOLVED_LABEL;
            } else {
                var watchStatus = myDojoModel.getWatchedState();
                if (watchStatus === Code.DOJO_STATUS_WATCHED) {
                    return this.DOJO_CSV_WATCH_LABEL;
                }
            }
            return this.DOJO_CSV_UNWATCH_LABEL;
        },
    });

    module.exports = DojoAchievementCsvModel;
});
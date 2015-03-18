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
    var AbstractView = require("modules/view/AbstractView");
    var RadClusterListItemView = require("modules/view/rad/top/RadClusterListItemView");
    var FeedListView = require("modules/view/news/FeedListView");
    var Code = require("modules/util/Code");
    var Super = FeedListView;

    /**
     * 放射線アプリのクラスター一覧を表示するためのViewクラスを作成する。
     * 
     * @class 放射線アプリのクラスター一覧を表示するためのView
     * @exports RadClusterListView
     * @constructor
     */
    var RadClusterListView = FeedListView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf RadClusterListView#
         */
        template : require("ldsh!templates/{mode}/top/radClusterList"),

        /**
         * 項目一覧を表示する要素のセレクタ
         * @memberOf RadClusterListView#
         */
        listElementSelector : "#rad-cluster-list",

        /**
         * 車載（役場）もしくは個人収集線量データの情報のどちら表示するか
         * municipalityであれば「役場」、privateであれば「自分」の情報を一覧に表示する
         * @memberOf RadClusterListView#
         */
        targetMeasurementType: Code.RAD_MEASUREMENT_MUNICIPALITY,

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadClusterListView#
         */
        afterRendered : function() {
            Super.prototype.afterRendered.call(this);

            this.collection.trigger("clusterListUpdated");
        },

        /**
         * 初期化
         * @memberOf RadClusterListView#
         */
        initialize : function() {
            Super.prototype.setFeedListItemViewClass.call(this, RadClusterListItemView);

            this.listenTo(this.collection, "tabSwitched", this.onTabSwitched.bind(this));
        },

        /**
         * 取得した項目一覧を描画する
         * @memberOf RadClusterListView#
         */
        setFeedList : function() {
            var self = this;
            var originalCollection = this.collection;
            var currentCollection = new Backbone.Collection();

            // 一覧の表示対象となるモデルをコレクションに追加する
            currentCollection.add(originalCollection.filter(function(model) {
                return (model.get("measurementType")) === self.targetMeasurementType;
            }));

            // 一時的にコレクションを入れ替え、一覧を表示する
            this.collection = currentCollection;
            Super.prototype.setFeedList.call(this);
            this.collection = originalCollection;
        },

        /**
         * タブが切り替わると呼ばれる
         * @memberOf RadClusterListView#
         * @param {String} selectedTabName
         */
        onTabSwitched : function(selectedTabName) {
            // タブの選択状態に応じて一覧の表示対象を変更する
            switch(selectedTabName) {
            case Code.RAD_MEASUREMENT_MUNICIPALITY:
                this.targetMeasurementType = Code.RAD_MEASUREMENT_MUNICIPALITY;
                break;
            case "mobile":
                this.targetMeasurementType = Code.RAD_MEASUREMENT_PRIVATE;
                break;
            }

            this.render();
        }
    });

    module.exports = RadClusterListView;
});

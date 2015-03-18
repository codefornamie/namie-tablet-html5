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
    var OpeRadiationListItemView = require("modules/view/ope/radiation/RadiationListItemView");
    var RadiationClusterCollection = require("modules/collection/radiation/RadiationClusterCollection");
    var vexDialog = require("vexDialog");

    /**
     * 車載線量計データ一覧画面のViewクラス
     * 
     * @class 車載線量計データ一覧画面のViewクラス
     * @exports RadiationListView
     * @constructor
     */
    var RadiationListView = AbstractView.extend({
        template : require("ldsh!templates/ope/radiation/radiationList"),
        radClusterCollection : new RadiationClusterCollection(),
        events : {
            "click [data-radiation-register-button]" : "onClickRadiationRegisterButton",
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlideshowListView#
         */
        beforeRendered : function() {
            this.radClusterCollection.each(function (model) {
                this.insertView("#radiationListfileArea", new OpeRadiationListItemView({
                    model : model
                }));
            }.bind(this));
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf RadiationListView#
         */
        afterRendered : function() {
            this.hideLoading();
        },
        /**
         * アップロードボタン押下時に呼び出される
         * @memberOf RadiationListView#
         */
        onClickRadiationRegisterButton : function() {
            app.router.opeRadiationRegist();
        },

        /**
         * 初期化処理
         * @memberOf OpeSlideshowListView#
         */
        initialize : function() {
            this.initCollection();
            this.initEvents();
        },

        /**
         * collectionを初期化する
         * @memberOf RadTopView#
         */
        initCollection : function() {
            this.radClusterCollection = new RadiationClusterCollection();
            //車載線量計データのみ取得する
            this.radClusterCollection.setSearchConditionByMunicipality();
            this.radClusterCollection.fetch().done(function(col) {
                if (col.size() === 0) {
                    return;
                }
                col.each(function(model) {
                    model.set("hidden", true);
                });
                col.at(0).set("hidden", false);
            });
        },

        /**
         * イベントを初期化する
         * @memberOf RadTopView#
         */
        initEvents : function() {
            this.listenTo(this.radClusterCollection, "sync", this.render);
        },
    });
    module.exports = RadiationListView;
});

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
/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    //var RadiationModel = require("modules/model/radiation/RadiationModel");
    //var RadiationCollection = require("modules/collection/radiation/RadiationCollection");
    var Equal = require("modules/util/filter/Equal");

    var HeaderView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/common/header"),
        //model : new RadiationModel(),
        //collection : new RadiationCollection(),

        beforeRendered : function() {
        },

        afterRendered : function() {
            //this.collection.fetch({success: $.proxy(this.onFetchRadiation,this)});
        },

        initialize : function() {
        },

        /**
         * RadiationエンティティセットへのFetch成功時のイベントハンドラ。
         */
        onFetchRadiation: function() {
            var model = this.collection.at(0);
            var value = "-";
            if (model) {
                value = model.get("value");
            }
            $("#radiationValue").text(value + "μSv/h");
        },

        events : {
            'click [data-drawer-opener]': 'onClickDrawerOpener',
            'change #selectRadiation' : "onChangeRadiationStation",
            'click .fontResizeButton' : "onClickFontResizeButton"
        },

        /**
         * 放射線量の測定地区Selectの選択イベントハンドラ。
         * @param {Object} ev イベントオブジェクト
         */
        onChangeRadiationStation: function(ev) {
            var value = $("#selectRadiation").val();
            //this.collection.condition.filter = "station eq '" + value + "'";
            this.collection.condition.filters = [new Equal("station", value)];
            this.collection.fetch({success: $.proxy(this.onFetchRadiation,this)});
        },
        /**
         * 文字サイズ変更ボタンがクリックされた際のイベントハンドラ.
         * @param {Object} ev イベントオブジェクト
         */
        onClickFontResizeButton: function(ev) {
            var fontSize = $(ev.currentTarget).attr("id");
            $("input[name='fontSize'][value='" + fontSize + "']")[0].click();
        }
    });

    module.exports = HeaderView;
});

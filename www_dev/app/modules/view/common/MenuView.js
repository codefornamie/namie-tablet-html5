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

    var MenuView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/common/menu"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {
        },

        events : {
            'click a': 'onClickAnchor',
            "click #top" : "onClickTop",
            "click #favorite" : "onClickFavorite",
            "click #help" : "onClickHelp",
            "click #backno" : "onClickBackno",
            "click #setting" : "onClickSetting"
        },

        /**
         * aタグをクリックした際の挙動を
         * ブラウザデフォルトではなく
         * pushStateに変更する
         */
        onClickAnchor: function (evt) {
            var $target = $(evt.currentTarget);
            var href = { prop: $target.prop("href"), attr: $target.attr("href") };
            var root = location.protocol + "//" + location.host + app.root;

            if (href.prop && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                app.router.navigate(href.attr, {
                    trigger: true,
                    replace: false
                });
            }
            $('#snap-content').data("snap").close();
        },
        onClickTop : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「TOP」","");
        },
        onClickFavorite : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「切り抜き」","");
        },
        onClickHelp : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「ヘルプ」","");
        },
        onClickBackno : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「バックナンバー」","");
        },
        onClickSetting : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「設定」","");
        }
    });

    module.exports = MenuView;
});

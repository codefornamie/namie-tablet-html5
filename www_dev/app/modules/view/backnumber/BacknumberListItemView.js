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

    /**
     *  バックナンバーのアイテムのView
     *
     *  @class バックナンバーのアイテムのView
     *  @exports BacknumberListItemView
     *  @constructor
     */
    var BacknumberListItemView = AbstractView.extend({
        /**
         *  テンプレートファイル
         *  @memberOf BacknumberListItemView#
         */
        template : require("ldsh!templates/{mode}/backnumber/backnumberListItem"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         *  @memberOf BacknumberListItemView#
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         *  @memberOf BacknumberListItemView#
         */
        afterRendered : function() {
            var self = this;
            var articleImageElement = this.$el.find(".articleImage");
            if (this.model.get("isPIOImage")) {
                this.showPIOImages(".articleImage", [
                    {
                        imageUrl : this.model.get("imageUrl"),
                        imageIndex : 1
                    }

                ]);
            } else if (!_.isEmpty(this.model.get("imageUrl"))) {
                articleImageElement.attr("src", this.model.get("imageUrl"));
            }
        },

        /**
         *  初期化処理
         *  @memberOf BacknumberListItemView#
         */
        initialize : function() {
            console.assert(this.model, "model should be specified");

            this.listenTo(this.model, "change", this.render);
        },

        events : {
            'click a': 'onClickAnchor'
        },

        /**
         * aタグをクリックした際の挙動を
         * ブラウザデフォルトではなく
         * pushStateに変更する
         *
         * @param {Event} evt
         * @memberOf BacknumberListItemView#
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
        }
    });
    module.exports = BacknumberListItemView;
});

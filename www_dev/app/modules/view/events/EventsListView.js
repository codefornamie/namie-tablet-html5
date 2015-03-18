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
    var EventsCollection = require("modules/collection/events/EventsCollection");
    var EventsListItemView = require("modules/view/events/EventsListItemView");

    var EventsListView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/events/eventsList"),

        beforeRendered : function() {
            this.setEventsList();
        },

        afterRendered : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {

        },
        /**
         * 取得した動画一覧を描画する
         */
        setEventsList : function() {
            var self = this;
            this.collection.each($.proxy(function(model) {
            	if (!model.get("eventDate")) { return; }

                this.insertView("#eventsList", new EventsListItemView({
                    model : model,
                }));
            }, this));

        }
    });

    module.exports = EventsListView;
});

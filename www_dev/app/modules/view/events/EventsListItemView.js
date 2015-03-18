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
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var EventsListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/events/eventsListItem"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {
            var self = this;

            if (!this.model.get("fileName")) {
                return;
            }
            app.box.col("dav").getBinary(this.model.get("fileName"), {
                success : function(binary) {
                    var arrayBufferView = new Uint8Array(binary);
                    var blob = new Blob([ arrayBufferView ], {
                        type : "image/jpg"
                    });
                    var url = FileAPIUtil.createObjectURL(blob);
                    var imgElement = self.$el.find("img");
                    imgElement.load(function() {
                        window.URL.revokeObjectURL(imgElement.attr("src"));
                    });
                    imgElement.attr("src", url);
                }
            });
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = EventsListItemView;
});

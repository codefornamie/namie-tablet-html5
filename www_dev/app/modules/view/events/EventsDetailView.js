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
/* global Nehan */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    require("nehan");
    var AbstractView = require("modules/view/AbstractView");
    
    var EventsDetailView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/events/eventsDetail"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {
            // data-nehan属性を持つ要素全てに
            // nehan.jsを適用する
            this.$el.find('[data-nehan]')
                .each(function () {
                    var $el = $(this);

                    var engine = Nehan.setup({
                        layout: {
                            "flow": "tb-rl",
                            "width": 600,
                            "height": 600,
                            fontSize: 32
                        }
                    });
                    
                    var content = $el.html();

                    $el.empty();
                    
                    engine
                        .createPageStream(content)
                        .asyncGet({
                            onProgress: function (stream, tree) {
                                var page = stream.getPage(tree.pageNo);

                                $el.append(page.element);
                            }
                        });
                });
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = EventsDetailView;
});

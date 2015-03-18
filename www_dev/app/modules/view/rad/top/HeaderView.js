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

    var AbstractView = require("modules/view/AbstractView");

    /**
     * 放射線アプリのヘッダのView
     *
     * @class 放射線アプリのヘッダのView
     * @exports RadHeaderView
     * @constructor
     */
    var RadHeaderView = AbstractView.extend({
        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * @memberOf RadHeaderView#
         */
        beforeRendered : function() {
            // TODO: ここでDOM操作をしない
            $("#header").hide();
        }
    });

    module.exports = RadHeaderView;
});

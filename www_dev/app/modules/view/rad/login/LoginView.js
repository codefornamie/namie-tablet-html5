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
    var CommonLoginView = require("modules/view/login/LoginView");

    /**
     * 放射線アプリのログイン画面を表示するためのViewクラスを作成する。
     *
     * @class 放射線アプリのログイン画面を表示するためのView
     * @exports RadLoginView
     * @constructor
     */
    var RadLoginView = CommonLoginView.extend({
        /**
         *  ログイン後の画面に遷移する
         *  @memberOf RadLoginView#
         */
        goNextView : function() {
            app.router.go("rad");
        }
    });

    module.exports = RadLoginView;
});

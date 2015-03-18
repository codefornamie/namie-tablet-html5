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

    var Class = require("modules/util/Class");
    /**
     * personium.io のログレベル定義。
     * @class personium.io のログレベル定義
     * @exports PIOLogLevel
     * @constructor
     */
    var PIOLogLevel = Class.extend({
        init : function(app) {

        }
    });
    /**
     * ログ種別：ERROR
     * @memberOf PIOLogLevel#
     */
    PIOLogLevel.ERROR = "ERROR";
    /**
     * ログ種別：WARN
     * @memberOf PIOLogLevel#
     */
    PIOLogLevel.WARN = "WARN";
    /**
     * ログ種別：INFO
     * @memberOf PIOLogLevel#
     */
    PIOLogLevel.INFO = "INFO";

    module.exports = PIOLogLevel;
});

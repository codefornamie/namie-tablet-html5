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
/* global fn: true */
/* global require: false */

fn = function(request) {
    var userscript;
    try {
        userscript = new common.ArticleUserScript(request);
        return userscript.execute();
    } catch (e) {
        if (e instanceof common.PIOUserScriptException) {
            return e.serialize();
        } else {
            return new common.PIOUserScriptException('Script Execution Failed.', [], e).serialize();
        }
        
    }
};
var common = require("common");

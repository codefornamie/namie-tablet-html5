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
    var AbstractModel = require("modules/model/AbstractModel");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    /**
     * YouTubeのモデルクラスを作成する。
     * 
     * @class YouTubeのモデルクラス
     * @exports YouTubeModel
     * @constructor
     */
    var YouTubeModel = AbstractModel.extend({
        parse : function(response, options) {
            var res = response.snippet;

            res.__id = response.id.videoId;
            res.kind = response.id.kind;
            res.videoId = response.id.videoId;
            res.dispCreatedAt = DateUtil.formatDate(new Date(res.publishedAt), "yyyy年MM月dd日 HH時mm分");
            res.thumbnail = res.thumbnails.high.url;
            res.dispTitle = CommonUtil.sanitizing(res.title);

            return res;
        }
    });

    module.exports = YouTubeModel;
});
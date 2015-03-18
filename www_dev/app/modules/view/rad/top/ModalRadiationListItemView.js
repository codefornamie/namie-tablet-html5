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
    var moment = require("moment");
    require("moment/locale/ja");


    /**
     * 線量データのアップロード用リストアイテムダイアログクラス
     * @class 線量データのアップロード用リストアイテムダイアログクラス
     * @exports ModalRadiationListItemView
     * @constructor
     */
    var ModalRadiationListItemView = AbstractView.extend({
        /**
         * テンプレート
         * @memberOf ModalRadiationListItemView#
         */
        template : require("ldsh!templates/rad/top/modal-radiationListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf ModalRadiationListItemView#
         */
        afterRendered : function() {
            if (this.fileEntry) {
                this.$el.find(".radiationItemFileName").text(this.fileEntry.name);
                this.$el.find(".radiationItemFileLastModified").text(moment(this.fileEntry.lastModifiedDate).format("lll"));
            }
            this.hideLoading();
        },

        initialize : function () {
        }
    });

    module.exports = ModalRadiationListItemView;
});

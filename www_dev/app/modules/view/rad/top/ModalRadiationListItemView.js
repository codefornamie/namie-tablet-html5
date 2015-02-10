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

    });

    module.exports = ModalRadiationListItemView;
});

define(function(require, exports, module) {
    "use strict";

    var Code = require("modules/util/Code");

    /**
     * Modelにmixinすると、画像タイプを判定できるようになる
     */
    var ImageTypeMixin = {
        /**
         * この記事の画像がpersonium.ioに保存されている画像かどうかを判定する。
         * @return {Boolean} personium.ioに保存されている画像の場合、<code>true</code>を返す。
         * @memberof ArticleModel#
         */
        isPIOImage: function() {
            // 記事タイプが1 or 2 の場合、imageUrlの画像がインターネットの画像
            // それ以外は、personium.io の画像
            if (this.get("type") === "1" || this.get("type") === "2") {
                return false;
            } else {
                return true;
            }
        },

        /**
         * 画像タイプを判定する
         * @return {Number} Code.IMAGE_TYPE_* を返す
         * @memberof ArticleModel
         */
        getImageType: function () {
            if (this.isPIOImage()) {
                return Code.IMAGE_TYPE_PIO;
            }

            if (!_.isEmpty(this.get("imageUrl"))) {
                return Code.IMAGE_TYPE_URL;
            }

            return Code.IMAGE_TYPE_NONE;
        }
    };

    module.exports = ImageTypeMixin;
});
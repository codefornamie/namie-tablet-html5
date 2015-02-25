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

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 車載線量計データ一覧画面のViewクラス
     * 
     * @class 車載線量計データ一覧画面のViewクラス
     * @exports RadiationListView
     * @constructor
     */
    var RadiationListView = AbstractView.extend({
        template : require("ldsh!templates/ope/radiation/radiationList"),
        events : {
            "click [data-radiation-register-button]" : "onClickRadiationRegisterButton",
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf RadiationListView#
         */
        afterRendered : function() {
            this.hideLoading();
        },
        /**
         * アップロードボタン押下時に呼び出される
         * @memberOf RadiationListView#
         */
        onClickRadiationRegisterButton : function() {
            app.router.opeRadiationRegist();
        }
    });
    module.exports = RadiationListView;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    /**
     * パーソナル情報のモデルクラスを作成する。
     * 
     * @class パーソナル情報のモデルクラス
     * @exports PersonalModel
     * @constructor
     */
    var PersonalModel = AbstractODataModel.extend({
        entity : "personal",
        /**
         * モデル固有の永続化データを生成する。
         */
        makeSaveData : function(saveData) {
            saveData.loginId = this.get("loginId");
            saveData.fontSize = this.get("fontSize");
        }

    });

    module.exports = PersonalModel;
});

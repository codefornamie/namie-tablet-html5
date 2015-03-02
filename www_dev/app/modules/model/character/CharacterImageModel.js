define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

    /**
     * キャラクターメッセージ情報のモデルクラスを作成する。
     * 
     * @class キャラクターメッセージ情報のモデルクラス
     * @exports AbstractODataModel#
     * @constructor
     */
    var CharacterImageModel = AbstractODataModel.extend({
        /**
         * このモデルに対応するEntitySet名
         * @memberOf CharacterImageModel#
         */
        entity : "configuration",
        /**
         * 取得したOData情報のparse処理を行う。
         * <p>
         * character_messageのプロパティをView表示用データに変換する
         * </p>
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf CharacterImageModel#
         */
        parseOData : function(response, options) {
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * ウィジェットキャラクター画像固有の情報を保存する処理を行う。
         * </p>
         * @param {Object} saveData 永続化データ
         * @memberOf CharacterImageModel#
         */
        makeSaveData : function(saveData) {
            saveData.__id = "WIDGET_CHARACTER_PATTERN";
            saveData.value = this.get("value");
            saveData.label = this.get("label");
            saveData.category = this.get("category");
        },
    });

    module.exports = CharacterImageModel;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

    /**
     * キャラクターメッセージ情報のモデルクラスを作成する。
     * 
     * @class キャラクターメッセージ情報のモデルクラス
     * @exports CharacterMessageModel#
     * @constructor
     */
    var CharacterMessageModel = AbstractODataModel.extend({
        /**
         * このモデルに対応するEntitySet名
         * @memberOf CharacterMessageModel#
         */
        entity : "character_message",
        /**
         * 取得したOData情報のparse処理を行う。
         * <p>
         * character_messageのプロパティをView表示用データに変換する
         * </p>
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf CharacterMessageModel#
         */
        parseOData : function(response, options) {
            switch (this.get("type")) {
            case 1:
                response.dispType = "通常";
                break;
            case 2:
                response.dispType = "おすすめ記事";
                break;
            default:
                response.dispType = "通常";
                break;
            }
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * キャラクターメッセージ固有の情報を保存する処理を行う。
         * </p>
         * @param {Object} saveData 永続化データ
         * @memberOf CharacterMessageModel#
         */
        makeSaveData : function(saveData) {
            saveData.type = this.get("type");
            saveData.message = this.get("message");
            saveData.weight = this.get("weight");
            saveData.enabled = this.get("enabled");
        },
        /**
         * このモデルの文字列情報を取得する
         * @memberOf CharacterMessageModel#
         * @return {String} このモデルの文字列情報
         */
        toString : function() {
            return "CharacterMessageModel [type:" + this.get("type") + ", message:" + this.get("message") +
                    ", weight:" + this.get("weight") + ", enabled:" + this.get("enabled") + "]";
        }
    });

    module.exports = CharacterMessageModel;
});

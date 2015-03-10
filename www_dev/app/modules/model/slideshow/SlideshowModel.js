define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var DateUtil = require("modules/util/DateUtil");
    /**
     * スライドショー情報のモデルクラスを作成する。
     * 
     * @class スライドショー情報のモデルクラス
     * @exports SlideshowModel
     * @constructor
     */
    var SlideshowModel = AbstractODataModel.extend({
        entity : "slideshow",
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、 永続化するデータを生成する処理を実装する。
         * </p>
         * @param {Object} saveData 永続化データ
         * @memberOf SlideshowModel#
         */
        makeSaveData : function(saveData) {
            saveData.filename = this.get("filename");
            saveData.published = this.get("published");
            saveData.publishedAt = this.get("publishedAt");
            saveData.depublishedAt = this.get("depublishedAt");
        },
        /**
         * このモデルの文字列情報を取得する
         * @memberOf SlideshowModel#
         * @return {String} このモデルの文字列情報
         */
        toString : function() {
            return "SlideshowModel [filename:" + this.get("filename") + ", published:" + this.get("published") +
                    ", publishedAt:" + this.get("publishedAt") + ", depublishedAt:" + this.get("depublishedAt") + "]";
        }
    });

    module.exports = SlideshowModel;
});

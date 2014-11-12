define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var CommonUtil = require("modules/util/CommonUtil");
    /**
     * お気に入り情報のモデルクラスを作成する。
     * 
     * @class お気に入り情報のモデルクラス
     * @exports FavoriteModel
     * @constructor
     */
    var FavoriteModel = AbstractODataModel.extend({
        entity : "favorite",
        /**
         * 取得したOData情報のparse処理を行う。
         * 
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            response.dispSite = CommonUtil.sanitizing(response.site ? response.site : "youtube");
            response.dispTitle = CommonUtil.sanitizing(response.title);
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         */
        makeSaveData : function(saveData) {
            saveData.source = this.get("source");
            saveData.userId = this.get("userId");
            var contents = this.get("contents");
            if (contents && contents.length > 100) {
                contents = contents.substr(0,100);
            }
            saveData.contents = contents;
            saveData.title = this.get("title");
            saveData.site = this.get("site");
            saveData.imageUrl = this.get("imageUrl");
            saveData.deliveryDate = this.get("deliveryDate");
            saveData.createdAt = this.get("createdAt");
        }

    });

    module.exports = FavoriteModel;
});

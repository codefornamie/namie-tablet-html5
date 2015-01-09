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
         * @param {Object} saveData 永続化データ
         * @memberOf PersonalModel#
         */
        makeSaveData : function(saveData) {
            saveData.loginId = this.get("loginId");
            saveData.fontSize = this.get("fontSize");
            saveData.showLastPublished = this.get("showLastPublished");
        },

        /**
         * showLastPublishedを更新する。
         * @memberOf PersonalModel#
         * @param {String} published 保存する発行日。指定しない場合は、現在の最新の新聞の発行日。
         */
        updateShowLastPublished : function(published) {
            published = published || app.currentPublishDate;
            var prev = this.get("showLastPublished");
            if (!prev || published > prev) {
                this.set("showLastPublished", published);
                var self = this;
                this.save(null, {
                    success : function() {
                        self.fetch({
                            success : function() {
                            },
                            error : function(err) {
                                app.logger.error(err);
                            }
                        });
                    },
                    error : function (err) {
                        app.logger.error(err);
                        // 更新に失敗した場合は、次回の呼び出しで再度更新を試みるよう、modelの値を戻しておく。
                        this.get("showLastPublished", prev);
                    }
                });
            }
        }
    });

    module.exports = PersonalModel;
});

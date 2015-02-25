define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var Code = require("modules/util/Code");
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
            saveData.roles = this.get("roles");
        },

        /**
         * showLastPublishedを更新する。
         * @memberOf PersonalModel#
         * @param {String} published 保存する発行日。指定しない場合は、現在の最新の新聞の発行日。
         */
        updateShowLastPublished : function(published) {
            published = published || app.currentPublishDate;
            var prev = this.get("showLastPublished");
            if (!prev || published !== prev) {
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
        },
        /**
         * このユーザが指定したロールを持つかを判定する。
         * @param {String} role ロール
         * @returns {Boolean} 指定したロールを持つ場合はtrue
         * @memberOf PersonalModel#
         */
        hasRole : function(role) {
            var rolesStr = this.get("roles");
            if (rolesStr) {
                var roles = this.get("roles").split(",");
                return roles.indexOf(role) >= 0;
            } else {
                return false;
            }
        },
        /**
         * このユーザがguestユーザかどうかを判定する。
         * @returns {Boolean} guestユーザの場合はtrue
         * @memberOf PersonalModel#
         */
        isGuest : function() {
            return this.get("loginId") === Code.GUEST_LOGIN_ID;
        }
    });

    module.exports = PersonalModel;
});

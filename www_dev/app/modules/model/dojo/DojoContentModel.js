define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var Code = require("modules/util/Code");

    /**
     * 道場のコンテンツのモデルクラスを作成する。
     * 
     * @class 記事情報のモデルクラス
     * @exports DojoContentModel
     * @constructor
     */
    var DojoContentModel = AbstractODataModel.extend({
        entity : "dojo_movie",
        /**
         * 取得したOData情報のparse処理を行う。
         * 
         * @memberof DojoContentModel#
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * 
         * @memberof DojoContentModel#
         */
        makeSaveData : function(saveData) {
        },
        /**
         * コンテンツの習得状態を文字列で返す ("solved" or "unsolved")
         * 
         * @memberof DojoContentModel#
         * @return {String}
         */
        getSolvedState : function() {
            if(this.achievementModels && this.achievementModels.length > 0) {
                var solvedModel = _.find(this.achievementModels,function(item) {
                    return item.get("type") === "dojo_solved"; 
                });
                return solvedModel ? Code.DOJO_STATUS_SOLVED : Code.DOJO_STATUS_UNSOLVED;
            }
            return Code.DOJO_STATUS_UNSOLVED;
        },

        /**
         * コンテンツの視聴状態を文字列で返す ("watched" or "unwatched")
         * 
         * @memberof DojoContentModel#
         * @return {String}
         */
        getWatchedState : function() {
            if(this.achievementModels && this.achievementModels.length > 0) {
                var watchedModel = _.find(this.achievementModels,function(item) {
                    return item.get("type") === "dojo_watched"; 
                });
                return watchedModel ? Code.DOJO_STATUS_WATCHED : Code.DOJO_STATUS_UNWATCHED; 
            }
            return Code.DOJO_STATUS_UNWATCHED;
        }
    });

    module.exports = DojoContentModel;
});
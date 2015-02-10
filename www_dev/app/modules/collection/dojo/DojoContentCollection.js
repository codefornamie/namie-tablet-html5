define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var DojoEditionCollection = require("modules/collection/dojo/DojoEditionCollection");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var CommonUtil = require("modules/util/CommonUtil");
    var Code = require("modules/util/Code");

    /**
     * 道場のコンテンツのコレクションクラス
     * 
     * @class 道場のコンテンツのコレクションクラス
     * @exports DojoContentCollection
     * @constructor
     */
    var DojoContentCollection = AbstractODataCollection.extend({
        model : DojoContentModel,
        /**
         * 操作対象のEntitySet名
         * @memberOf DojoContentCollection#
         */
        entity : "dojo_movie",
        /**
         * youtubeCollection
         * @memberOf DojoContentCollection#
         */
        youtubeCollection: null,
        /**
         * achievementCollection
         * @memberOf DojoContentCollection#
         */
        achievementCollection: null,
        /**
         * 初期化処理
         * @memberOf DojoContentCollection#
         */
        initialize : function() {
            this.condition = {
                top : 100,
                orderby : "sequence desc"
            };
        },
        /**
         * レスポンス情報のパースを行う。
         * @memberOf DojoContentCollection#
         * @param {Array} レスポンス情報の配列
         * @param {Object} オプション
         * @returns DojoContentCollection
         */
        parseOData : function(response, options) {
            if (!this.youtubeCollection) {
                return response;
            }
            if (this.youtubeCollection) {
                this.youtubeCollection.each(function(youtube) {
                    _.each(response, function(res) {
                        if (res.videoId === youtube.get("videoId")) {
                            // タイトル、サムネイル画像、詳細は最新の情報を取得する
                            res.title = youtube.get("dispTitle");
                            res.thumbnail = youtube.get("thumbnail");
                            res.description = youtube.get("description");
                        }
                    });
                });
            }
            return response;
        },


        /**
         * collectionが持つmodelを◯◯編ごとに分配し、それをDojoEditionCollectionとして返す
         * @memberOf DojoContentCollection#
         * @return {DojoEditionCollection} 編ごとの情報をもつ道場動画コレクション
         */
        groupByEditions: function () {
            var editionCollection = new DojoEditionCollection();

            this.each(function (model) {
                // この model を入れる先の DojoEditionModel を決定する
                /* 本来の処理
                var editionKey = model.get("category");
                */
                // 編を固定
                var editionKey = "タブレットの使い方";
                var editionModel = editionCollection.findWhere({
                    editionKey: editionKey
                });
                
                // 既にこのeditionを入れる先があれば、そこに入れる
                // まだ無ければ、作って入れる
                if (!editionModel) {
                    editionModel = new DojoEditionModel({
                        editionKey: editionKey,
                        editionTitle: CommonUtil.sanitizing(editionKey)
                    });
                    editionModel.set("contentCollection", new DojoContentCollection());
                    editionCollection.push(editionModel);
                }

                var contentCollection = editionModel.get("contentCollection");
                contentCollection.push(model);
                editionModel.set("contentCollection", contentCollection);
            });
            // 並び順反映
            editionCollection.each(function(edModel) {
                var edContentCollection = edModel.get("contentCollection");
                edContentCollection.models = _.sortBy(edContentCollection.models, function(content) {
                    return parseInt(content.get("sequence"));
                });
            });
            
            editionCollection.models = _.sortBy(editionCollection.models,function(model) {
                var editionKey = model.get("editionKey");
                var category = _.find(Code.DOJO_CATEGORY_LIST,function(item) {
                    return item.key === editionKey;
                }); 
                return category ? category.value : "";
                
            });
            return editionCollection;
        },
        /**
         * このコレクションに含まれる達成情報がどのlevelまで完了していないかを返却する
         * @memberOf DojoContentCollection#
         * @returns Number 完了していない最初レベル.なにも完了していない場合は0
         */
        getNotAchievementedLevel : function() {
            if (!this.models || (this.models && this.models.length === 0) ) {
                return 0;
            }
            var achievementArr = [];
            
            _.each(this.models, function(model) {
                var solvedItem = _.find(model.achievementModels,function(ach){
                    return ach.get("type") === "dojo_" + Code.DOJO_STATUS_SOLVED;
                });
                if (!solvedItem) {
                    achievementArr.push(model.get("level"));
                }
            });
            var maxNum = Code.DOJO_LEVELS.length - 1;
            var minNum = _.sortBy(achievementArr, function(num) {
                return num;
            })[0];
            return minNum === undefined ? maxNum : minNum;
        },
    });

    module.exports = DojoContentCollection;
});

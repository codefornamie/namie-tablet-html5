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
     * @class
     * @exports DojoContentCollection
     * @constructor
     */
    var DojoContentCollection = AbstractODataCollection.extend({
        model : DojoContentModel,
        entity : "dojo_movie",
        condition : {
            top : 100,
            orderby : "sequence desc"
        },
        youtubeCollection: null,
        achievementCollection: null,
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
         * @memberof DojoContentCollection#
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
        }
    });

    module.exports = DojoContentCollection;
});

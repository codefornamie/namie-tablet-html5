define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var DateUtil = require("modules/util/DateUtil");

    /**
     * PCS ODataの操作を行うモデルの基底クラスを作成する。
     * 
     * @class PCS ODataの操作を行うモデルの基底クラス
     * @exports AbstractODataModel
     * @constructor
     */
    var AbstractODataModel = Backbone.Model.extend({
        cell : "namiedev01",
        box : "box1",
        odata : "odata01",
        entity : "entity01",
        sync : function(method, model, options) {
            if (!options) {
                options = {};
            }
            // dc1-clientによるODataアクセスを行う
            var odataCollection = app.accessor.cell(this.cell).box(this.box).odata(this.odata);
            this.entityset = odataCollection.entitySet(this.entity);

            var complete = function(res) {
                // 取得したJSONオブジェクト
                var json = null;
                if (res.error) {
                    if (options.error) {
                        options.error(res);
                    }
                } else if (options.success) {
                    if (res.bodyAsJson) {
                        json = res.bodyAsJson();
                    }
                    if (json && json.d) {
                        json = json.d.results;
                    }
                    options.success(json);
                }

                if (options.complete) {
                    options.complete(res, model, json);
                }
            };
            switch (method) {
            case 'create':
                this.create(method, model, options, complete);
                break;
            case 'update':
                this.update(method, model, options, complete);
                break;
            case 'delete':
                this.del(method, model, options, complete);
                break;
            case 'read':
                this.retrieve(method, model, options, complete);
                break;
            }
        },
        create : function(method, model, options, complete) {
            this.entityset.createAsResponse(this.getSaveData(), {
                complete : function(response) {
                    complete(response);
                }
            });
        },
        update : function(method, model, options) {
            this.entityset.update(this.get("id"), this.getSaveData(), this.get("etag"), {
                complete : function(response) {
                    complete(response);
                }
            });
        },
        del : function(method, model, options) {
            this.entityset.del(this.get("id"), this.get("etag"), {
                complete : function(response) {
                    complete(response);
                }
            });
        },
        retrieve : function(method, model, options, complete) {
            // var dataList = entityset.query().filter().top(1000).run();
            this.entityset.retrieveAsResponse(this.get("id"), {
                complete : function(response) {
                    complete(response);
                }
            });
        },
        /**
         * 取得情報のparse処理を行う。
         * <p>
         * サブクラスがparse処理を行う場合、parseODataメソッドをオーバライドして行う。
         * </p>
         * 
         * @return {Object} パース後の情報
         */
        parse : function(response, options) {
            var res = this.parseOData(response, options);
            // 全ての情報で共通のパース処理を実施する
            if (response && response.__metadata) {
                res.etag = response.__metadata.etag;
            }
            return res;
        },
        /**
         * 取得したOData情報のparse処理を行う。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、取得した情報のparse処理を実装する。
         * </p>
         * 
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            return {};
        },
        /**
         * PCSへの永続化データを生成する。
         * 
         * @return {Object} JSON オブジェクト
         */
        getSaveData : function() {
            var saveData = {};
            if (this.get("__id")) {
                saveData.__id = this.get("__id");
            }
            saveData.createdAt = this.get("createdAt");
            if (!saveData.created) {
                saveData.createdAt = new Date().toISOString();
            }
            saveData.updatedAt = new Date().toISOString();

            this.makeSaveData(saveData);

            return saveData;
        },
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、 永続化するデータを生成する処理を実装する。
         * </p>
         */
        makeSaveData : function(saveData) {

        }
    });

    module.exports = AbstractODataModel;
});

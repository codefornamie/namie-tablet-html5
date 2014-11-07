define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");

    /**
     * PCS ODataの操作を行うモデルの基底クラスを作成する。
     * 
     * @class PCS ODataの操作を行うモデルの基底クラス
     * @exports AbstractODataModel
     * @constructor
     */
    var AbstractODataModel = AbstractModel.extend({
        /**
         * idとして使用するattribute中のフィールド
         */
        idAttribute : "__id",
        /**
         * セルID
         */
        cell : null,
        /**
         * Box名
         */
        box : null,
        /**
         * ODataCollection名
         */
        odata : null,
        /**
         * 操作対象のEntitySet名
         */
        entity : null,

        /**
         * PCS ODataの取得・登録・更新・削除処理を行う。
         * 
         * @param {String}
         *            method メソッド
         * @param {Object}
         *            model モデル
         * @param {Object}
         *            options オプション情報
         */
        sync : function(method, model, options) {
            if (!options) {
                options = {};
            }
            // PCS設定情報読み込み
            this.cell = app.config.basic.cellId;
            this.box = app.config.basic.boxName;
            this.odata = app.config.basic.odataName;

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
        /**
         * PCS ODataの登録処理を行う。
         * 
         * @param {String}
         *            method メソッド
         * @param {Object}
         *            model モデル
         * @param {Object}
         *            options オプション情報
         * @param {Function}
         *            complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *            以下のシグネチャの関数を指定する。<br>
         *            <code>complete (response:Object)</code><br>
         *            responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         */
        create : function(method, model, options, complete) {
            this.entityset.createAsResponse(this.getSaveData(), {
                complete : function(response) {
                    complete(response);
                }
            });
        },
        /**
         * PCS ODataの更新処理を行う。
         * 
         * @param {String}
         *            method メソッド
         * @param {Object}
         *            model モデル
         * @param {Object}
         *            options オプション情報
         * @param {Function}
         *            complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *            以下のシグネチャの関数を指定する。<br>
         *            <code>complete (response:Object)</code><br>
         *            responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         */
        update : function(method, model, options, complete) {
            this.entityset.update(this.get("__id"), this.getSaveData(), this.get("etag"), {
                complete : function(response) {
                    complete(response);
                }
            });
        },
        /**
         * PCS ODataの削除処理を行う。
         * 
         * @param {String}
         *            method メソッド
         * @param {Object}
         *            model モデル
         * @param {Object}
         *            options オプション情報
         * @param {Function}
         *            complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *            以下のシグネチャの関数を指定する。<br>
         *            <code>complete (response:Object)</code><br>
         *            responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         */
        del : function(method, model, options, complete) {
            this.entityset.del(this.get("__id"), this.get("etag"), {
                complete : function(response) {
                    complete(response);
                }
            });
        },
        /**
         * PCS ODataの取得処理を行う。
         * 
         * @param {String}
         *            method メソッド
         * @param {Object}
         *            model モデル
         * @param {Object}
         *            options オプション情報
         * @param {Function}
         *            complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *            以下のシグネチャの関数を指定する。<br>
         *            <code>complete (response:Object)</code><br>
         *            responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         */
        retrieve : function(method, model, options, complete) {
            this.entityset.retrieveAsResponse(this.get("__id"), {
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
        parseResponse : function(response, options) {
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

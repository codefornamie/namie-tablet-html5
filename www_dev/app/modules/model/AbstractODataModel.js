/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");
    var PIOEvent = require("modules/event/PIOEvent");

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
         * @memberOf AbstractODataModel#
         */
        idAttribute : "__id",
        /**
         * セルID
         * @memberOf AbstractODataModel#
         */
        cell : null,
        /**
         * Box名
         * @memberOf AbstractODataModel#
         */
        box : null,
        /**
         * ODataCollection名
         * @memberOf AbstractODataModel#
         */
        odata : null,
        /**
         * 操作対象のEntitySet名
         * @memberOf AbstractODataModel#
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
         * @memberOf AbstractODataModel#
         */
        sync : function(method, model, options) {
            app.logger.debug("AbstractODataModel sync");
            var def = $.Deferred();
            if (!options) {
                options = {};
            }
            // PCS設定情報読み込み
            this.cell = app.config.basic.cellId;
            this.box = app.config.basic.boxName;
            this.odata = app.config.basic.odataName;

            // dc1-clientによるODataアクセスを行う
            var odataCollection = app.box.odata(this.odata);
            this.entityset = odataCollection.entitySet(this.entity);

            var complete = function(res) {
                app.logger.debug("AbstractODataModel complete handler");
                // personium.ioのAPI呼び出し情報を保持するイベント
                // 便宜上、resオブジェクトに紐付ける
                var event = new PIOEvent(res);
                app.logger.info("AbstractODataModel complete event:" + event);

                res.event = event;
                // 取得したJSONオブジェクト
                var json = null;

                if (!event.isSuccess()) {
                    if (options.error) {
                        options.error(res);
                    }
                    def.reject(res);
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
                
                if (def.state() === "pending") {
                    def.resolve(res);
                }
            };
            app.logger.debug("Request personium. method : " + method);
            try {
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
            } catch (e) {
                app.logger.error("Personium Exception : " + e);
                app.router.go("login");
            }
            return def.promise();
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
         * @memberOf AbstractODataModel#
         */
        create : function(method, model, options, complete) {
            app.logger.debug("AbstractODataModel create");
            this.entityset.createAsResponse(this.getSaveData(), {
                complete : function(response) {
                    app.logger.debug("AbstractODataModel create complete");
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
         * @memberOf AbstractODataModel#
         */
        update : function(method, model, options, complete) {
            app.logger.debug("AbstractODataModel update");
            this.entityset.update(this.get("__id"), this.getSaveData(), this.get("etag"), {
                complete : function(response) {
                    app.logger.debug("AbstractODataModel update complete");
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
         * @memberOf AbstractODataModel#
         */
        del : function(method, model, options, complete) {
            app.logger.debug("AbstractODataModel delete");
            this.entityset.del(this.get("__id"), this.get("etag"), {
                complete : function(response) {
                    app.logger.debug("AbstractODataModel delete complete");
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
         * @memberOf AbstractODataModel#
         */
        retrieve : function(method, model, options, complete) {
            app.logger.debug("AbstractODataModel retrieve");
            this.entityset.retrieveAsResponse(this.get("__id"), {
                complete : function(response) {
                    app.logger.debug("AbstractODataModel retrieve complete");
                    complete(response);
                }
            });
        },
        /**
         * 取得情報のparse処理を行う。
         * <p>
         * サブクラスがparse処理を行う場合、parseODataメソッドをオーバライドして行う。
         * </p>
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf AbstractODataModel#
         */
        parseResponse : function(response, options) {
            //app.logger.debug("AbstractODataModel parseResponse");
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
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf AbstractODataModel#
         */
        parseOData : function(response, options) {
            //app.logger.debug("AbstractODataModel parseOData");
            return response;
        },
        /**
         * PCSへの永続化データを生成する。
         *
         * @return {Object} JSON オブジェクト
         * @memberOf AbstractODataModel#
         */
        getSaveData : function() {
            app.logger.debug("AbstractODataModel getSaveData");
            var saveData = {};
            if(this.id){
                saveData.__id = this.id;
            }
            if (this.get("__id")) {
                saveData.__id = this.get("__id");
            }
            saveData.createdAt = this.get("createdAt");
            if (!saveData.createdAt) {
                saveData.createdAt = new Date().toISOString();
            }
            saveData.updatedAt = new Date().toISOString();
            if (this.get("isDelete")) {
                saveData.deletedAt = new Date().toISOString();
            } else {
                saveData.deletedAt = null;
            }
            saveData.ownerId = this.get("ownerId");

            this.makeSaveData(saveData);

            return saveData;
        },
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、 永続化するデータを生成する処理を実装する。
         * </p>
         * @param {Object} saveData 永続化データ
         * @memberOf AbstractODataModel#
         */
        makeSaveData : function(saveData) {

        }
    });

    module.exports = AbstractODataModel;
});

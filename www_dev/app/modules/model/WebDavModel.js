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
    var PIOImage = require("modules/util/PIOImage");
    var PIOEvent = require("modules/event/PIOEvent");
    /**
     * WevDavにアクセスするモデル。
     * 
     * @class WevDavにアクセスするモデル
     * @exports AbstractModel
     * @constructor
     */
    var WebDavModel = AbstractModel.extend({
        /**
         * idとして使用するattribute中のフィールド
         * @memberOf WebDavModel#
         */
        idAttribute : "path",

        urlRoot : "/dav",
        path : "",
        url : function() {
            return this.urlRoot + "/" + this.getPath();
        },
        getPath : function(path) {
            return "";
        },
        /**
         * PCS Davの取得・登録・更新・削除処理を行う。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @memberOf WebDavModel#
         */
        sync : function(method, model, options) {
            app.logger.debug("WebDavModel sync");
            var def = $.Deferred();

            if (!options) {
                options = {};
            }
            // PCS設定情報読み込み
            this.cell = app.config.basic.cellId;
            this.box = app.config.basic.boxName;
            this.dav = app.box.col("dav");

            var complete = function(res) {
                app.logger.debug("WebDavModel search complete handler");
                // personium.ioのAPI呼び出し情報を保持するイベント
                // 便宜上、resオブジェクトに紐付ける
                var event = new PIOEvent(res);
                app.logger.debug("WebDavModel complete event:" + event);

                res.event = event;
                if (res.byteLength === 0) {
                    if (options.error) {
                        options.error(res);
                    }
                    def.reject(res);
                } else if (options.success) {
                    if (!event.isSuccess()) {
                        if (method === "delete" && event.isNotFound()) {
                            // 対象のデータが存在しなかった場合、WARNを出して処理を継続する
                            app.logger.warn("Delete method requested. but target file not found in webdav. event=" + event);
                            options.success(res);
                        } else {
                            if (options.error) {
                                options.error(res);
                            }
                        }

                    } else {
                        options.success(res);
                    }
                }

                if (options.complete) {
                    options.complete(res, model);
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
                app.logger.debug("Personium Exception : " + e);
                app.router.go("login");
            }
            return def.promise();
        },
        /**
         * PCS Davの登録処理を行う。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         * @memberOf WebDavModel#
         */
        create : function(method, model, options, complete) {
            app.logger.debug("WebDavModel create");
            var path = this.get("path");
            if (!path) {
                new Error("path is null.");
            }
            var fileName = this.get("fileName");
            var contentType = this.get("contentType");
            var data = this.get("data");
            var onSuccess = options.success;
            var onFailure = options.failure;

            try {
                this.mkCol(path);
            } catch (e) {
                complete(e);
                return;
            }

            this.dav.put(path + "/" + this.get("fileName"), {
                body : data,
                headers : {
                    body : data,
                    "Content-Type" : this.get("contentType"),
                    "If-Match" : "*"
                },
                success : $.proxy(function(e) {
                    complete(e);
                }, this),
                error : $.proxy(function(e) {
                    complete(e);
                }, this)
            });
        },
        /**
         * PCS Davの更新処理を行う。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         * @memberOf WebDavModel#
         */
        update : function(method, model, options, complete) {
            app.logger.debug("WebDavModel update");
            this.create(method, model, options, complete);
        },
        /**
         * PCS Davの削除処理を行う。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         * @memberOf WebDavModel#
         */
        del : function(method, model, options, complete) {
            app.logger.debug("WebDavModel delete");
            var path = this.get("path");
            if (!path) {
                new Error("path is null.");
            }
            var fileName = this.get("fileName");
            var onSuccess = options.success;
            var onFailure = options.failure;

            this.dav.del(path + "/" + this.get("fileName"), {
                success : $.proxy(function(e) {
                    app.logger.debug("WebDavModel delete complete");
                    complete(e);
                }, this),
                error : $.proxy(function(e) {
                    complete(e);
                }, this)
            });
        },
        /**
         * PCS Davの取得処理を行う。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         * @memberOf WebDavModel#
         */
        retrieve : function(method, model, options, complete) {
            PIOImage.getBinaryWithCache(this.dav, this.id, {
                success : $.proxy(function(binary) {
                    complete(binary);
                }, this),
                error : $.proxy(function(e) {
                    complete(e);
                }, this)
            });
        },
        /**
         * PCS Davコレクションを作成する。
         * 
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         * @memberOf WebDavModel#
         */
        mkCol : function(path) {
            var dav = app.box.col("dav");
            var idx = path.lastIndexOf("/");
            if (idx > 0) {
                var parentPath = path.substring(0, idx);
                this.mkCol(parentPath);
            }
            try {
                dav.mkCol(path);
            } catch (e) {
                if (e.code != "PR405-DV-0001") {
                    throw e;
                }
            }
        }
    });

    module.exports = WebDavModel;
});

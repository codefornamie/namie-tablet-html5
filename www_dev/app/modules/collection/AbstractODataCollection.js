define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var Filter = require("modules/util/filter/Filter");
    var PIOEvent = require("modules/event/PIOEvent");

    /**
     * PCS ODataの検索操作を行うモデルの基底クラスを作成する。
     *
     * @class PCS ODataの検索操作を行うモデルの基底クラス
     * @exports AbstractODataCollection
     * @constructor
     */
    var AbstractODataCollection = AbstractCollection.extend({
        /**
         * searchで分割して撮る際のリクエストあたりの取得件数。
         */
        NUM_DOCS_PER_REQUEST : 10000,
        /**
         * セルID
         * @memberOf AbstractODataCollection#
         */
        cell : null,
        /**
         * Box名
         * @memberOf AbstractODataCollection#
         */
        box : null,
        /**
         * ODataCollection名
         * @memberOf AbstractODataCollection#
         */
        odata : null,
        /**
         * 操作対象のEntitySet名
         * @memberOf AbstractODataCollection#
         */
        entity : null,
        /**
         * 検索条件
         * @memberOf AbstractODataCollection#
         */
        condition : null,
        /**
         * 初期化処理
         * @memberOf AbstractODataCollection#
         */
        initialize : function() {
            this.condition = {
                    top: 100
            };
        },
        /**
         * 検索して取得した情報(JSONデータ)をパースする。
         * <p>
         * 全てのOData検索処理で共通するパース処理をこのメソッド内に実装する。<br/>
         * サブクラスが独自のパース処理を行いたい場合、parseODataメソッドをオーバライドすること。
         * </p>
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @memberOf AbstractODataCollection#
         */
        parseResponse : function(response, options) {
            //app.logger.info("AbstractODataCollection parseResponse");
            response = this.parseOData(response, options);
            return response;
        },
        /**
         * 検索して取得した情報(JSONデータ)をパースする。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、独自のパース処理を実装することができる。
         * </p>
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後のデータ
         * @memberOf AbstractODataCollection#
         *
         */
        parseOData : function(response, options) {
            //app.logger.info("AbstractODataCollection parseOData");
            return response;
        },
        /**
         * PCS ODataの検索処理を行う。
         *
         * @param {String}
         *            method メソッド
         * @param {Object}
         *            model モデル
         * @param {Object}
         *            options オプション情報
         * @memberOf AbstractODataCollection#
         */
        sync : function(method, model, options) {
            app.logger.debug("AbstractODataCollection sync");

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

            /**
             * レスポンスボディの解析を行う。
             * @param {String} res レスポンスボディ
             * @memberOf AbstractODataCollection#
             */
            var complete = function(res) {
                app.logger.debug("AbstractODataCollection search complete handler");

                // personium.ioのAPI呼び出し情報を保持するイベント
                // 便宜上、resオブジェクトに紐付ける
                var event = new PIOEvent(res);
                app.logger.info("AbstractODataCollection complete event:" + event);
                res.event = event;
                // 取得したJSONオブジェクト
                var json = null;

                if (!event.isSuccess()) {
                    if (options.error) {
                        options.error(res);
                    }
                    def.reject(res);
                } else if (options.success) {
                    if (res.concatedJson) {
                        json = res.concatedJson;
                    } else if (res.bodyAsJson) {
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
                    def.resolve(json);
                }
            };

            try {
                this.search(method, model, options, complete);
            } catch (e) {
                app.logger.info("Personium Exception : " + e);
                //app.router.go("login");
                window.location.href = "/";
            }

            return def.promise();
        },
        /**
         * PCS ODataの検索処理を行う。
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
         *            responseオブジェクトから、PCSが返却した検索情報を取得することができる。
         * @memberOf AbstractODataCollection#
         */
        search : function(method, model, options, complete) {
            app.logger.debug("AbstractODataCollection search");
            this.condition = Filter.searchCondition(this.condition);
            // 件数が多い場合は、分割してリクエストを投げるが、内部的に__idでソートが必要なため、外からorderbyを指定できない。
            console.assert(this.condition.top <= this.NUM_DOCS_PER_REQUEST || !this.condition.orderby,
                    "can't spesify $orderby when $top over " + this.NUM_DOCS_PER_REQUEST + ".");
            if (this.condition.top <= this.NUM_DOCS_PER_REQUEST) {
                this.entityset.query().filter(this.condition.filter).top(this.condition.top).orderby(
                        this.condition.orderby).run({
                    complete : function(response) {
                        app.logger.debug("AbstractODataCollection search complete");
                        complete(response);
                    }
                });
            } else {
                // 件数が多い場合は分割してリクエストを投げる。
                (function findLoop(savedResults, nextId) {
                    savedResults = savedResults || [];
                    nextId = nextId || "0";
                    var filter;
                    if (this.condition) {
                        filter = this.condition.filter;
                    }
                    if (filter) {
                        filter = "(" + filter + ") and __id gt '" + nextId + "'";
                    } else {
                        filter = "__id gt '" + nextId + "'";
                    }
                    this.entityset.query().filter(filter).top(this.NUM_DOCS_PER_REQUEST).orderby("__id").run({
                        complete : function(res) {
                            app.logger.debug("AbstractODataCollection search part complete");
                            if (res.error) {
                                complete(res);
                                return;
                            }
                            var json = res.bodyAsJson();
                            if (!json.d) {
                                json.d = {results: []};
                            }
                            Array.prototype.push.apply(savedResults, json.d.results);
                            if (json.d.results.length < this.NUM_DOCS_PER_REQUEST) {
                                json.d.results = savedResults;
                                res.concatedJson = json;
                                app.logger.debug("AbstractODataCollection search all complete");
                                complete(res);
                                return;
                            }
                            findLoop.bind(this)(savedResults, json.d.results[this.NUM_DOCS_PER_REQUEST - 1].__id);
                        }.bind(this)
                    });
                }).bind(this)();
            }
        }
    });

    module.exports = AbstractODataCollection;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var Filter = require("modules/util/filter/Filter");
    var LoginModel = require("modules/model/LoginModel");
    var Log = require("modules/util/Logger");

    /**
     * PCS ODataの検索操作を行うモデルの基底クラスを作成する。
     *
     * @class PCS ODataの検索操作を行うモデルの基底クラス
     * @exports AbstractODataCollection
     * @constructor
     */
    var AbstractODataCollection = AbstractCollection.extend({
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
         * 検索条件
         */
        condition : {
            top : 1,
            orderby : ""
        },
        /**
         * 検索して取得した情報(JSONデータ)をパースする。
         * <p>
         * 全てのOData検索処理で共通するパース処理をこのメソッド内に実装する。<br/>
         * サブクラスが独自のパース処理を行いたい場合、parseODataメソッドをオーバライドすること。
         * </p>
         */
        parseResponse : function(response, options) {
            //Log.info("AbstractODataCollection parseResponse");
            response = this.parseOData(response, options);
            return response;
        },
        /**
         * 検索して取得した情報(JSONデータ)をパースする。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、独自のパース処理を実装することができる。
         * </p>
         *
         * @return {Object} パース後のデータ
         *
         */
        parseOData : function(response, options) {
            //Log.info("AbstractODataCollection parseOData");
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
         */
        sync : function(method, model, options) {
            Log.info("AbstractODataCollection sync");

            var def = $.Deferred();

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
                Log.info("AbstractODataCollection search complete handler");

                // 取得したJSONオブジェクト
                var json = null;

                if (res.error) {
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
                    def.resolve(json);
                }
            };

            try {
                this.search(method, model, options, complete);
            } catch (e) {
                Log.info("Personium Exception : " + e);
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
         */
        search : function(method, model, options, complete) {
            Log.info("AbstractODataCollection search");
            this.condition = Filter.searchCondition(this.condition);
            this.entityset.query().filter(this.condition.filter).top(this.condition.top).orderby(this.condition.orderby).run({
                complete : function(response) {
                    Log.info("AbstractODataCollection search complete");
                    complete(response);
                }
            });
        }
    });

    module.exports = AbstractODataCollection;
});

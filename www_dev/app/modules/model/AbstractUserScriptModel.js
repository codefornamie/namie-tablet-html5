define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var PIOEvent = require("modules/event/PIOEvent");

    /**
     * personium.io UserScriptの操作を行うモデルの基底クラスを作成する。
     * 
     * @class personium.io UserScriptの操作を行うモデルの基底クラス
     * @exports AbstractUserScriptModel
     * @constructor
     */
    var AbstractUserScriptModel = AbstractODataModel.extend({
        /**
         * ServiceCollectionの名称
         */
        service : 'api',
        /**
         * 呼び出すUserScriptの名称
         */
        serviceName : null,
        /**
         * ユーザースクリプトを呼び出す。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、UserScriptが返却したレスポンス情報を取得することができる。
         * @memberOf AbstractUserScriptModel#
         */
        call: function(method, model, options, complete) {
            var createFormUrlEncodedData = this.createFormUrlEncodedData({
                d : JSON.stringify(this.getSaveData())
            });

            app.box.service(this.service).call(method, this.serviceName, {
                body : createFormUrlEncodedData,
                complete : function(response) {
                    app.logger.debug("AbstractUserScriptModel " + method + " complete. event:" + response.event);
                    complete(response);
                }
            });
        },
        /**
         * UserScriptの登録処理を行う。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、UserScriptが返却したレスポンス情報を取得することができる。
         * @memberOf AbstractUserScriptModel#
         */
        create : function(method, model, options, complete) {
            app.logger.debug("AbstractUserScriptModel create");
            this.call(method, model, options, complete);
        },
        /**
         * PCS ODataの更新処理を行う。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         * @memberOf AbstractUserScriptModel#
         */
        update : function(method, model, options, complete) {
            app.logger.debug("AbstractUserScriptModel update");
            this.call(method, model, options, complete);
        },
        /**
         * PCS ODataの削除処理を行う。
         * 
         * @param {String} method メソッド
         * @param {Object} model モデル
         * @param {Object} options オプション情報
         * @param {Function} complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *                以下のシグネチャの関数を指定する。<br>
         *                <code>complete (response:Object)</code><br>
         *                responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         * @memberOf AbstractUserScriptModel#
         */
        del : function(method, model, options, complete) {
            app.logger.debug("AbstractUserScriptModel delete");
            this.call(method, model, options, complete);
        },
        /**
         * 指定されたJSONデータを form-urlencoded の形式に変換する
         * @param {Object} data JSONオブジェクト
         * @returns {String} form-urlencodedの形式の文字列
         */
        createFormUrlEncodedData : function(data) {
            var formUrlEncodedData = null;
            var qps = [];
            for ( var key in data) {
                var value = data[key];
                if (value) {
                    qps.push(key + "=" + encodeURIComponent(value));
                }
            }
            if (qps.length > 0) {
                formUrlEncodedData = qps.join("&");
            }
            return formUrlEncodedData;
        }
    });

    module.exports = AbstractUserScriptModel;
});

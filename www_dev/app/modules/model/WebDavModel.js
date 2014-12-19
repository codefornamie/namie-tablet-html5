define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");
    var Log = require("modules/util/Logger");
    /**
     * WevDavにアクセスするモデル。
     * 
     * @class WevDavにアクセスするモデル
     * @exports AbstractModel
     * @constructor
     */
    var WebDavModel = AbstractModel.extend({
        urlRoot : "/dav",
        path : "",
        url : function(){
            return this.urlRoot + "/" + this.getPath();
        },
        getPath : function(path){
            return "";
        },
        /**
         * PCS Davの取得・登録・更新・削除処理を行う。
         *
         * @param {String}
         *            method メソッド
         * @param {Object}
         *            model モデル
         * @param {Object}
         *            options オプション情報
         */
        sync : function(method, model, options) {
            Log.info("WebDavModel sync");
            if (!options) {
                options = {};
            }
            // PCS設定情報読み込み
            this.cell = app.config.basic.cellId;
            this.box = app.config.basic.boxName;
            this.dav = app.box.col("dav");

            var complete = function(res) {
                Log.info("WebDavModel search complete handler");
                if (res.byteLength === 0) {
                    if (options.error) {
                        options.error(res);
                    }
                } else if (options.success) {
                    options.success(res);
                }

                if (options.complete) {
                    options.complete(res, model, json);
                }
            };
            Log.info("Request personium. method : " + method);
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
                Log.info("Personium Exception : " + e);
                app.router.go("login");
            }
        },
        /**
         * PCS Davの登録処理を行う。
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
            Log.info("WebDavModel create");
            var path = this.get("path");
            var fileName = this.get("fileName");
            var contentType = this.get("contentType");
            var data = this.get("data");
            var onSuccess = options.success;
            var onFailure = options.failure;
            
            this.mkCol(path);
            this.dav.put(path + "/" + this.get("fileName"),{
                body : data,
                headers : {
                    body : data,
                    "Content-Type" : this.get("contentType"),
                    "If-Match" : "*"
                },
                success : $.proxy(function(e){
                    complete(e);
                }, this),
                error: $.proxy(function(e){
                    complete(e);
                }, this)
            });
                    
//            dav.put(image.fileName, {
//                body : image.data,
//                headers : {
//                    "Content-Type" : this.get("contentType"),
//                    "If-Match" : "*"
//                },
//                success : $.proxy(function(e){
//                    complete(e);
//                }, this),
//                error: $.proxy(function(e){
//                    complete(e);
//                }, this)
//            });
//            
//            this.entityset.createAsResponse(this.getSaveData(), {
//                complete : function(response) {
//                    Log.info("WebDavModel create complete");
//                    complete(response);
//                }
//            });
        },
        /**
         * PCS Davの更新処理を行う。
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
            Log.info("WebDavModel update");
            this.create(method, model, options, complete);
        },
        /**
         * PCS Davの削除処理を行う。
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
            //Log.info("WebDavModel delete");
            throw new Error("UnsupportedOperationException: delete()");
        },
        /**
         * PCS Davの取得処理を行う。
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
            this.dav.getBinary(this.id, {
                success : $.proxy(function(e){
                    complete(e);
                }, this),
                error: $.proxy(function(e){
                    complete(e);
                }, this)
            });
        },
        /**
         * PCS Davコレクションを作成する。
         *
         * @param {Function}
         *            complete 検索処理が完了した際に呼び出されるコールバック関数。<br>
         *            以下のシグネチャの関数を指定する。<br>
         *            <code>complete (response:Object)</code><br>
         *            responseオブジェクトから、PCSが返却したレスポンス情報を取得することができる。
         */
        mkCol : function(path) {
            var dav = app.box.col("dav");
            var idx = path.lastIndexOf("/");
            if ( idx > 0){
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

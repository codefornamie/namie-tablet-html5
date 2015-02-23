define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var JsSha = require("jsSha");
    var PersonalCollection = require("modules/collection/personal/PersonalCollection");
    var ConfigurationCollection = require("modules/collection/misc/ConfigurationCollection");
    var PersonalModel = require("modules/model/personal/PersonalModel");
    var Equal = require("modules/util/filter/Equal");
    var And = require("modules/util/filter/And");
    var IsNull = require("modules/util/filter/IsNull");
    var Code = require("modules/util/Code");

    /**
     * ログイン画面のモデルクラスを作成する。
     * 
     * @class ログイン画面のモデルクラス
     * @exports LoginModel
     * @constructor
     */
    var LoginModel = Backbone.Model.extend({
        /** ログインID
         * @memberOf LoginModel#
         */
        loginId : null,
        /** パスワード
         * @memberOf LoginModel#
         */
        password : null,
        /** 暗号化済みパスワード
         * @memberOf LoginModel#
         */
        encryptionPassword : null,
        /** ログイン完了後に呼び出されるコールバック関数
         * @memberOf LoginModel#
         */
        onLogin : null,
        /** baseurl
         * @memberOf LoginModel#
         */
        baseUrl : null,
        /** cellId
         * @memberOf LoginModel#
         */
        cellId : null,
        /** box
         * @memberOf LoginModel#
         */
        box : null,
        /** Account Manager
         * @memberOf LoginModel#
         */
        accountManager : null,
        /** package name
         * @memberOf LoginModel#
         */
        packageName : "jp.fukushima.namie.town.Pcs",

        /**
         * モデルの初期化処理を行う。
         * @param {Object} options オプション情報
         * @memberOf LoginModel
         */
        initialize : function(options) {
            this.baseUrl = app.config.basic.baseUrl;
            this.cellId = app.config.basic.cellId;
            this.box = app.config.basic.boxName;
            if (window.plugins) {
                this.accountManager = window.plugins.accountmanager;
            }
        },

        /**
         * 入力された認証情報のバリデータ。
         * @memberOf LoginModel
         * @return 入力エラーがある場合、tureを返す。
         */
        validate : function() {
            // 検証には、underscore の便利メソッドを使っている。
            if (!this.get("loginId")) {
                return "ログインIDが入力されていません。";
            }
            if (!this.get("password")) {
                return "パスワードが入力されていません。";
            }
            return false;
        },

        /**
         * ID/PWでPCS認証を行う。
         * @memberOf LoginModel#
         * @param {String} id ユーザーID
         * @param {String} pw パスワード
         */
        certificationWithAccount : function(id, pw) {
            app.logger.debug("start certificationWithAccount");
            var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
            dcContext.setAsync(true);
            var accessor = dcContext.asAccount(this.cellId, id, pw);
            var cellobj = accessor.cell(this.cellId);
            var targetBox = cellobj.box("data");
            app.accessor = cellobj.accessor;
            app.box = targetBox;
            var token = cellobj.getAccessToken();
            app.logger.debug("token = " + token);
            // app.pcsManager.setAccessToken(token);
            app.pcsManager.setTokenAndExpiresInValue(cellobj);
            // app.pcsManager.accessToken = token;
            app.logger.debug("end certificationWithAccount");
        },

        /**
         * トークンを指定してPCS接続。
         * @memberOf LoginModel#
         * @param {String} token アクセストークン
         */
        certificationWithToken : function() {
            app.logger.debug("set access token : " + app.pcsManager.accessToken);
            var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
            dcContext.setAsync(true);
            try {
                var cellobj = dcContext.withToken(app.pcsManager.accessToken).cell(this.cellId);
                var targetBox = cellobj.box("data");
                app.accessor = cellobj.accessor;
                app.box = targetBox;
                app.logger.debug("personium certification success with token.");
            } catch (e) {
                app.logger.debug("certificate failure : " + e);
            }
        },

        /**
         * AccountManagerにアカウントを登録する。
         * @param {String} id ユーザーID
         * @param {String} pw パスワード
         * @memberOf LoginModel#
         */
        registAccountManager : function(id, pw) {
            if (window.plugins) {
                this.accountManager = window.plugins.accountmanager;
            }
            if (this.accountManager) {
                app.logger.debug("start regist account for AccountManager");
                var param = {
                    baseUrl : this.baseUrl,
                    cellName : this.cellId,
                    schema : "",
                    boxName : this.box
                };
                this.accountManager.addAccountExplicitly(this.packageName, id, pw, param, function(error, account) {
                    app.logger.debug("account manager addAccountExplicitly responsed");
                    if (error) {
                        this.onLogin("login failure : " + error);
                        return;
                    }
                });
            } else {
                app.logger.debug("account manager undefined (not android)");
            }
        },

        /**
         * 認証処理を行う。
         * <p>
         * このモデルのloginId,passwordプロパティの値を利用して、認証処理を行う。<br>
         * 以下の場合、認証エラーとなる
         * <ul>
         * <li>ログインID,パスワードに誤りがあった場合</li>
         * </ul>
         * </p>
         * @memberOf LoginModel#
         * @param {Function} onLogin 認証完了後に呼び出されるコールバック関数。
         */
        login : function(onLogin) {
            app.logger.debug("login method in LoginModel start");
            this.onLogin = onLogin;
            try {
                if (app.pcsManager.accessToken) {
                    app.logger.debug("app.pcsManager.accessToken is exist");
                    this.certificationWithToken();
                } else {
                    var id = this.get("loginId");
                    var pw = this.get("encryptionPassword");
                    app.logger.debug("app.pcsManager.accessToken is null / loginId : " + id);
                    if (!pw) {
                        // パスワードを暗号化
                        var shaPassword = "";
                        var shaObj = new JsSha(this.get("password"), "ASCII");
                        shaPassword = shaObj.getHash("SHA-256", "HEX");
                        pw = shaPassword.substr(0, 32);
                    }
                    this.certificationWithAccount(id, pw);
                    app.logger.debug("token certification success. start regist AccountManager");
                    app.pcsManager.registAccountManager(id, pw, function() {
                        app.logger.debug("regist account success");
                    }, function(error) {
                        app.logger.debug("error regist account : " + error);
                    });
                }
            } catch (e) {
                app.logger.debug("login failure msg : " + e);
                var message = "";
                if (e.name === "NetworkError" || e.name === "NETWORK_ERR") {
                    message = "ネットワーク接続エラーが発生しました。";
                } else {
                    message = "ユーザーID、または、パスワードが正しくありません。";
                }
                app.logger.debug("login exception : " + message);
                this.onLogin(message);
                return;
            }
            async.parallel([
                    $.proxy(this.loadPersonal, this), $.proxy(this.loadConfiguration, this)
            ], $.proxy(this.onLogin, this));

        },

        /**
         * パーソナル情報の読み込みを行う。
         * @memberOf LoginModel#
         * @param {Function} callback パーソナル情報取得処理が完了した際に呼び出されるコールバック関数
         */
        loadPersonal : function(callback) {
            var collection = new PersonalCollection();
            if (_.isEmpty(this.get("loginId")) && app.pcsManager.isAndroidDevice()) {
                // AccountManager からログインIDを取得し、ログインモデルに設定する
                var loginId = app.pcsManager.androidAccountManager.getAccountsByType(app.pcsManager.packageName,
                        $.proxy(function(res, accounts) {
                            app.logger.debug("accounts=" + accounts);
                            app.logger.debug("accounts[0].name =" + accounts[0].name);
                            this.set("loginId", accounts[0].name);
                            this.fetchPersonalInfo(collection, callback);
                        }, this));
            } else {
                this.fetchPersonalInfo(collection, callback);
            }
            
        },
        /**
         * パーソナル情報取得処理を開始する。
         * @memberOf LoginModel#
         * @param {Collection} collection パーソナル情報コレクション
         * @param {Function} callback 取得処理完了後に呼び出すコールバック関数
         */
        fetchPersonalInfo : function(collection, callback) {
            if (this.get("loginId") === Code.GUEST_LOGIN_ID) {
                var guest = new PersonalModel();
                guest.set("__id", Code.GUEST_LOGIN_ID);
                guest.set("loginId", Code.GUEST_LOGIN_ID);
                app.user = guest;
                callback();
                return;
            }
            collection.condition.filters = [
                new And([
                        new Equal("loginId", this.get("loginId")), new IsNull("deletedAt")
                ])
            ];
            app.logger.debug("personal collection fetch start");
            collection.fetch({
                success : $.proxy(function() {
                    app.logger.debug("petsonal collection fetch success. count : " + collection.size());
                    if (collection.size() !== 0) {
                        app.logger.debug("already exist personal info");
                        // 既にパーソナル情報が登録されている場合
                        app.user = collection.models[0];
                        callback();
                    } else {
                        app.logger.debug("Not found personal info.");
                        // パーソナル情報が登録されていない場合
                        var personalModel = new PersonalModel();
                        personalModel.set("loginId", this.get("loginId"));
                        personalModel.set("fontSize", "middle");
                        personalModel.save(null, {
                            success : $.proxy(function() {
                                app.logger.debug("personal info create success");
                                // パーソナル情報新規登録成功
                                app.user = personalModel;
                                callback();
                            }, this),
                            error : $.proxy(function() {
                                app.logger.debug("personal info create faulure");
                                // パーソナル情報新規登録に失敗
                                callback("ユーザ情報の登録に失敗しました。再度ログインしてください。");
                                app.logger.error("ユーザ情報の登録に失敗しました。再度ログインしてください。");
                            }, this)
                        });
                    }
                }, this),
                error : $.proxy(function() {
                    app.logger.debug("peronal collection fetch failure.");
                    // パーソナル情報検索に失敗
                    callback("ユーザ情報の取得に失敗しました。再度ログインしてください。");
                    app.logger.error("ユーザ情報の取得に失敗しました。再度ログインしてください。");
                }, this)
            });
        },
        /**
         * 設定情報を読み込む
         * @param {Function} callback トークン取得成功時のコールバック
         * @memberOf LoginModel#
         */
        loadConfiguration : function(callback) {
            // 設定情報の読み込み
            var confCol = new ConfigurationCollection();
            confCol.fetch({
                success : function(col, models) {
                    app.serverConfig = col.toMap();
                    callback();
                },
                error : $.proxy(function() {
                    // 取得に失敗
                    callback("設定情報の取得に失敗しました。再度ログインしてください。");
                    app.logger.error("設定情報の取得に失敗しました。再度ログインしてください。");
                }, this)
            });
        },

        /**
         * アクセストークンを設定する
         * @param {String} token アクセストークン
         * @memberOf LoginModel#
         */
        setAccessToken : function(token) {
            app.logger.debug("set access token : " + token);
            this.accessToken = token;
        }
    });
    module.exports = LoginModel;
});

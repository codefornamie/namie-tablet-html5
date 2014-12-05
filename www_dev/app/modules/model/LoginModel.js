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

    /**
     * ログイン画面のモデルクラスを作成する。
     *
     * @class ログイン画面のモデルクラス
     * @exports LoginModel
     * @constructor
     */
    var LoginModel = Backbone.Model.extend({
        /** ログインID */
        loginId : null,
        /** パスワード */
        password : null,
        /** 暗号化済みパスワード */
        encryptionPassword : null,
        /** ログイン完了後に呼び出されるコールバック関数 */
        onLogin : null,
        /** baseurl */
        baseUrl : null,
        /** cellId */
        cellId : null,
        /** box */
        box : null,
        /** Account Manager */
        accountManager : null,
        /** package name */
        packageName : "jp.fukushima.namie.town.Pcs",
        /** Access Token */
        accessToken : "",

        /**
         * モデルの初期化処理を行う。
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
         * AccountManagerにアカウントが登録されていればトークンの取得を行う。
         * @memberOf LoginModel
         * @param {Function} callback トークン取得成功時のコールバック
         */
        isExistAccountInAccountManager : function(callback) {
            if (window.plugins) {
                this.accountManager = window.plugins.accountmanager;
            }
            if (!this.accountManager) {
                app.logger.debug("account maanger undefined (not android)");
                callback("showLoginView", "");
                return;
            }
            //alert("アカウントマネージャ認証開始");
            this.accountManager.getAccountsByType(this.packageName, $.proxy(function(error, accounts) {
                //alert("アカウントマネージャチェック終了 : " + accounts.length + "件");
                app.logger.debug("account manager getAccountsByType method responsed ");
                if (error) {
                    app.logger.debug("account manager error : " + error);
                    callback("showLoginView", "");
                    return;
                } else if (!accounts || !accounts.length) {
                    app.logger.debug("this device has no accounts");
                    callback("showLoginView", "");
                    return;
                }
                var account = accounts[0];
                this.set("loginId", account.name);
                /*
                this.accountManager.getPassword(account, $.proxy(function(error, password) {
                    if (!error) {
                        this.set("encryptionPassword", password);
                        alert(password);
                        callback("skipLoginView", "");
                    } else {
                        callback("showLoginView", "");
                    }
                }, this));
                */

                this.accountManager.getAuthToken(0, "oauth", function(error, token) {
                    //alert("トークン取得成功 : " + token);
                    app.logger.debug("account manager getAuthToken responsed : " + token);
                    if (error) {
                        callback("error", error);
                    } else {
                        callback("token", token);
                    }
                });

            }, this));
        },

        /**
         * 入力された認証情報のバリデータ。
         * @memberOf LoginModel
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
         * @memberOf LoginModel
         * @param {String} id ユーザーID
         * @param {String} pw パスワード
         */
        certificationWithAccount : function(id, pw) {
            var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
            dcContext.setAsync(true);
            var accessor = dcContext.asAccount(this.cellId, id, pw);
            var cellobj = accessor.cell(this.cellId);
            var targetBox = cellobj.box("data");
            app.accessor = cellobj.accessor;
            app.box = targetBox;
        },

        /**
         * トークンを指定してPCS接続。
         * @memberOf LoginModel
         * @param {String} token アクセストークン
         */
        certificationWithToken : function() {
            //alert("トークン認証(?)開始");
            app.logger.debug("set access token : " + this.accessToken);
            var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
            dcContext.setAsync(true);
            try {
                var cellobj = dcContext.withToken(this.accessToken).cell(this.cellId);
                var targetBox = cellobj.box("data");
                app.accessor = cellobj.accessor;
                app.box = targetBox;
            } catch (e) {
                //alert("トークン認証でエラー : " + e);
                app.logger.debug("certificate failure : " + e);
            }
        },

        /**
         * AccountManagerにアカウントを登録する。
         * @param {String} id ユーザーID
         * @param {String} pw パスワード
         */
        registAccountManager : function(id, pw) {
            if (window.plugins) {
                this.accountManager = window.plugins.accountmanager;
            }
            if (this.accountManager) {
                //alert("アカウントマネージャ登録開始");
                var param = {
                    baseUrl : this.baseUrl,
                    cellName : this.cellId,
                    schema : "",
                    boxName : this.box
                };
                this.accountManager.addAccountExplicitly(this.packageName, id, pw, param,
                        function(error, account) {
                            app.logger.debug("account manager addAccountExplicitly responsed");
                            if (error) {
                                this.onLogin("login failure : " + error);
                                return;
                            }
                            //alert("アカウントマネージャ登録成功");
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
         *
         * @memberOf LoginModel
         * @param {Function} onLogin 認証完了後に呼び出されるコールバック関数。
         */
        login : function(onLogin) {
            app.logger.debug("login method in LoginModel start");
            this.onLogin = onLogin;
            try {
                if (this.accessToken) {
                    this.certificationWithToken();
                } else {
                    var id = this.get("loginId");
                    var pw = this.get("encryptionPassword");
                    if (!pw) {
                        // パスワードを暗号化
                        var shaPassword = "";
                        var shaObj = new JsSha(this.get("password"), "ASCII");
                        shaPassword = shaObj.getHash("SHA-256", "HEX");
                        pw = shaPassword.substr(0, 32);
                    }

                    this.certificationWithAccount(id, pw);
                    this.registAccountManager(id, pw);
                }
            } catch (e) {
                var message = "";
                if (e.name === "NetworkError") {
                    message = "ネットワーク接続エラーが発生しました。";
                } else {
                    message = "ユーザーID、または、パスワードが正しくありません。";
                }
                app.logger.debug("login exception : " + message);
                this.onLogin(message);
                return;
            }
            async.parallel([
                    $.proxy(this.loadPersonal, this), 
                    $.proxy(this.loadConfiguration, this)
            ], $.proxy(this.onLogin, this));
            
        },

        loadPersonal : function(callback){
            //alert("パ情作成開始");
            //alert(this.get("loginId"));
            var collection = new PersonalCollection();
            collection.condition.filters = [
                new And([
                        new Equal("loginId", this.get("loginId")), new IsNull("deletedAt")
                ])
            ];
            collection.fetch({
                success : $.proxy(function() {
                    if (collection.size() !== 0) {
                        // 既にパーソナル情報が登録されている場合
                        app.user = collection.models[0];
                        callback();
                    } else {
                        // パーソナル情報が登録されていない場合
                        var personalModel = new PersonalModel();
                        personalModel.set("loginId",this.get("loginId"));
                        personalModel.set("fontSize","middle");
                        personalModel.save(null,{
                            success : $.proxy(function() {
                                // パーソナル情報新規登録成功
                                app.user = personalModel;
                                callback();
                            }, this),
                            error: $.proxy(function() {
                                // パーソナル情報新規登録に失敗
                                callback("ユーザ情報の登録に失敗しました。再度ログインしてください。");
                                app.logger.error("ユーザ情報の登録に失敗しました。再度ログインしてください。");
                            },this)
                        });
                    }
                }, this),
                error: $.proxy(function() {
                    // パーソナル情報検索に失敗
                    callback("ユーザ情報の取得に失敗しました。再度ログインしてください。");
                    app.logger.error("ユーザ情報の取得に失敗しました。再度ログインしてください。");
                },this)
            });
        },
        loadConfiguration : function(callback){
            // 設定情報の読み込み
            var confCol = new ConfigurationCollection();
            confCol.fetch({
                success : function(col, models) {
                    app.config = _.extend(app.config, col.toMap());
                    callback();
                },
                error: $.proxy(function() {
                    // 取得に失敗
                    callback("設定情報の取得に失敗しました。再度ログインしてください。");
                    app.logger.error("設定情報の取得に失敗しました。再度ログインしてください。");
                },this)
            });
        },

        setAccessToken : function(token) {
            app.logger.debug("set access token : " + token);
            this.accessToken = token;
        }
    });
    module.exports = LoginModel;
});

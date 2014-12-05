define(function(require, exports, module) {
    "use strict";
    var Log = require("modules/util/Logger");

    /**
     * アクセスマネージャクラスを作成する。
     * @class アクセスマネージャクラス
     * @exports AccountManager
     * @constructor
     */
    var PcsManager = function(app) {
        /** appオブジェクト */
        this.app = app;
        /** package name */
        this.packageName = "jp.fukushima.namie.town.Pcs";
        /** アクセストークン */
        this.accessToken = "";
        /** リフレッシュトークン */
        this.refreshToken = "";
        /** トークンの有効期限 */
        this.expirationDate = "";
        /** リフレッシュトークンの有効期限 */
        this.expirationRefreshDate = "";
        /** Android アカウントマネージャ */
        this.androidAccountManager = null;
        /** ログインID */
        this.loginId = "";
        /** Expireチェックのマージン時間 */
        this.expireMargin = 300 * 1000; // 5分
        /** ExpiresInチェック : トークンなし */
        this.NOT_HAVE_TOKEN = 0;
        /** ExpiresInチェック : 期限内 */
        this.UNEXPIRE_ACCESS_TOKEN = 1;
        /** ExpiresInチェック : 期限切れ/リフレッシュ可能 */
        this.EXPIRE_ACCESS_TOKEN = 2;
        /** ExpiresInチェック : リフレッシュ期限切れ */
        this.EXPIRE_REFRESH_TOKEN = 3;
        /** personium lib */
        this.pcs = new dcc.DcContext(this.app.config.basic.baseUrl, this.app.config.basic.cellId);
        this.pcs.setAsync(true);
    };

    /**
     * アクセストークンのセット。
     * @param value トークン文字列
     */
    PcsManager.prototype.setAccessToken = function(value) {
        Log.info("set access token : " + token);
        this.accessToken = value;
    };

    /**
     * 現在の動作がデバイス上か非デバイスかを判別する。
     * @returns {Boolean} true:デバイス上、false:非デバイス
     */
    PcsManager.prototype.isAndroidDevice = function() {
        var ret = false;
        if (window.plugins) {
            this.androidAccountManager = window.plugins.accountmanager;
        }
        if (this.androidAccountManager) {
            return true;
        }
        return ret;
    };

    /**
     * 現在保持されているトークンが有効期限が切れているかどうかチェックする。
     * @returns {Number}
     */
    PcsManager.prototype.isExpireCachedToken = function() {
        if (this.accessToken) {
            var now = (new Date()).getTime();
            if (this.expirationRefreshDate) {
                if (now > (parseInt(this.expirationRefreshDate) - this.expireMargin)) {
                    Log.info("Expired refresh token : " + this.expirationRefreshDate);
                    return this.EXPIRE_REFRESH_TOKEN; // リフレッシュトークの期限切れ
                }
            }
            if (this.expirationDate) {
                if (now > (parseInt(this.expirationDate) - this.expireMargin)) {
                    Log.info("Expired access token : " + this.expirationDate);
                    return this.EXPIRE_ACCESS_TOKEN; // 期限切れ、リフレッシュ可能期間内
                } else {
                    Log.info("Unexpired access token : " + this.expirationDate);
                    return this.UNEXPIRE_ACCESS_TOKEN; // 期限内
                }
            }
        }
        Log.info("Do not have token");
        return this.NOT_HAVE_TOKEN; // トークンが存在しない
    };

    /**
     * Personiumアクセス時にトークのチェックを行い、アクセス可能な状態にする。
     * @param {Function} callback 処理完了後に呼び出されるコールバック
     */
    PcsManager.prototype.ready = function(callback) {
        // 現在の環境がAndroidデバイス上か？
        var androidDevice = this.isAndroidDevice();
        // 保持しているトークンの状態(期限チェック)
        var tokenStatus = this.isExpireCachedToken();
        Log.info("isAndroidDevice? : " + androidDevice);
        Log.info("Access Token status is : " + tokenStatus);

        // 保持しているトークンが利用できる場合は、何もせずに復帰
        if (tokenStatus === this.UNEXPIRE_ACCESS_TOKEN) {
            // 期限内
            callback();
            return;
        }
        // 期限外で、Androidの場合は、AccountManagerからトークン再取得
        if (androidDevice) {
            // AccountManagerからトークンを再取得
            this.getAuthTokenFromDeviceAccountManager({
                success: function() {
                    callback();
                },
                error: function(msg) {
                    callback(msg);
                }
            });
        } else {
            var cellName = this.app.config.basic.cellId;
            if (tokenStatus === this.EXPIRE_ACCESS_TOKEN) {
                // 期限切れ、リフレッシュ可能期間内
                // リフレッシュ認証を行う
                var as = this.pcs.getAccessorWithRefreshToken(cellName, this.refreshToken);
                var cell = as.cell();
                this.setTokenAndExpiresInValue(cell);
                callback();
            }
            if ((tokenStatus === this.EXPIRE_REFRESH_TOKEN) ||
                    (tokenStatus === this.NOT_HAVE_TOKEN)) {
                // ログイン画面へ
                this.accessToken = "";
                this.expirationDate = "";
                this.expirationRefreshDate = "";
                this.refreshToken = "";
                callback();
            }
        }
    };

    /**
     * トークン、Expires-In などのアクセス情報をセット。
     * @param {Object} cell Cellオブジェクト
     */
    PcsManager.prototype.setTokenAndExpiresInValue = function(cell) {
        var now = (new Date()).getTime();
        this.accessToken = cell.getAccessToken();

        var expiresIn = cell.getExpiresIn();
        this.expirationDate = now + (expiresIn * 1000);

        var expiresRefreshIn = cell.getRefreshExpiresIn();
        this.expirationRefreshDate = now + (expiresRefreshIn * 1000);

        this.refreshToken = cell.getRefreshToken();
    };

    /**
     *　AndroidのAccountManagerからトークンを取得する。
     * @param {Object} param 引数
     */
    PcsManager.prototype.getAuthTokenFromDeviceAccountManager = function(param) {
        Log.info("call getAccountsByType of AccountManager");
        this.androidAccountManager.getAccountsByType(this.packageName, $.proxy(function(error, accounts) {
            Log.info("getAccountsByType of AccountManager method responsed ");
            if (error) {
                param.error("account manager error : " + error);
                return;
            }
            if (!accounts || !accounts.length) {
                Log.info("this device has no accounts");
                this.expirationDate = "";
                this.accessToken = "";
                param.success();
                return;
            }
            var account = accounts[0];
            this.loginId = account.name;

            Log.info("call getAuthToken of AccountManager");
            this.androidAccountManager.getAuthToken(0, this.packageName, $.proxy(function(error, token) {
                Log.info("getAuthToken of AccountManager responsed : " + token);
                if (error) {
                    Log.info("error getAuthToken from AccountManager error-message:" + error);
                    param.error(error);
                    return;
                }
                this.accessToken = token;
                // トークンの有効期限(expires-in)を取得する
                Log.info("call getUserData of AccountManager");
                this.androidAccountManager.getUserData(account, "ExpiresIn", $.proxy(function(error, data) {
                    if (error) {
                        Log.info("error getUserData from AccountManager error-message:" + error);
                        param.error(error);
                        return;
                    }
                    this.expirationDate = data;
                    Log.info("set expirationDate : " + data);
                    // 次回はキャッシュされたトークンが取得されないように、キャッシュをクリアする
                    this.androidAccountManager.invalidateAuthToken(this.packageName, this.accessToken, function(error) {
                        if (error) {
                            Log.info("error invalidateAuthToken from AccountManager error-message:" + error);
                        }
                    });
                    param.success();
                }, this));
            }, this));
        }, this));
    };

    /**
     * AccountManagerにアカウントを登録する。
     * @param {String} id ユーザーID
     * @param {String} pw パスワード
     * @param {Function} onSuccess 成功時のコールバック
     * @param {Function} onError エラー時のコールバック
     */
    PcsManager.prototype.registAccountManager = function(id, pw, onSuccess, onError) {
        Log.info("stadrt registAccountManager");
        if (window.plugins) {
            this.androidAccountManager = window.plugins.accountmanager;
        }
        if (this.androidAccountManager) {
            var param = {
                baseUrl : this.app.config.basic.baseUrl,
                cellName : this.app.config.basic.cellId,
                schema : this.app.config.basic.schema,
                boxName : this.app.config.basic.boxName
            };
            Log.info("regist start to AccountManager param : " + JSON.stringify(param));
            this.androidAccountManager.addAccountExplicitly(this.packageName, id, pw, param, function(error, account) {
                Log.info("regist account to AccountManager responsed");
                if (error) {
                    onError("error addAccountExplicitly from  AccountManager error-message:" + error);
                    return;
                }
                onSuccess();
            });
        } else {
            Log.info("account manager undefined (not android device)");
        }
    };
    module.exports = PcsManager;
});

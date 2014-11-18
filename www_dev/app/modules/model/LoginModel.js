define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var PersonalCollection = require("modules/collection/personal/PersonalCollection");
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
        /** ログイン完了後に呼び出されるコールバック関数 */
        onLogin : null,
        /** baseurl */
        baseUrl : null,
        /** cellId */
        cellId : null,
        /** box */
        box : null,
        /**
         * モデルの初期化処理を行う。
         */
        initialize: function(options) {
            this.baseUrl = app.config.basic.baseUrl;
            this.cellId = app.config.basic.cellId;
            this.box = app.config.basic.boxName;
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
         * @param {Function}
         *            onLogin 認証完了後に呼び出されるコールバック関数。
         */
        login : function(onLogin) {
            this.onLogin = onLogin;

            try {
                var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
                dcContext.setAsync(true);

                var accessor = dcContext.asAccount(this.cellId, this.get("loginId"), this.get("password"));
                // ODataコレクションへのアクセス準備（実際の認証処理）
                var cellobj = accessor.cell();
                var targetBox = cellobj.box("data");
                app.accessor = cellobj.accessor;
                app.box = targetBox;
            } catch (e) {
                var message = "";
                if (e.name === "NetworkError") {
                    message = "ネットワーク接続エラーが発生しました。";
                } else {
                    message = "ユーザーID、または、パスワードが正しくありません。";
                }
                this.onLogin(message);
                return;
            }
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
                        this.onLogin();
                    } else {
                        // パーソナル情報が登録されていない場合
                        var personalModel = new PersonalModel();
                        personalModel.set("loginId",this.get("loginId"));
                        personalModel.set("fontSize","middle");
                        personalModel.save(null,{
                            success : $.proxy(function() {
                                // パーソナル情報新規登録成功
                                app.user = personalModel;
                                this.onLogin();
                            }, this),
                            error: $.proxy(function() {
                                // パーソナル情報新規登録に失敗
                                this.onLogin("ユーザ情報の登録に失敗しました。再度ログインしてください。");
                            },this)
                        });
                    }
                }, this),
                error: $.proxy(function() {
                    // パーソナル情報検索に失敗
                    this.onLogin("ユーザ情報の取得に失敗しました。再度ログインしてください。");
                },this)
            });
        },
    });
    module.exports = LoginModel;
});

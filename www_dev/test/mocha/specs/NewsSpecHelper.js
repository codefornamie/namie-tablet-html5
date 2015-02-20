define(function(require, exports, module) {
    "use strict";
    var app = require("app");
    var async = require("async");
    var moment = require("moment");
    var SpecHelper = require("specHelper");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var Code = require("modules/util/Code");

    /**
     * なみえ新聞アプリの単体テストで必要となる共通処理(テスト用記事データ作成、削除など)を、提供するクラスを作成する。
     * @class なみえ新聞アプリのテストの共通処理を提供するクラス
     * @exports NewsSpecHelper
     * @constructor
     */
    var NewsSpecHelper = SpecHelper.extend({
        init : function() {
            this._super();
        }
    });

    /**
     * テスト用の記事データを作成する
     * @param {String} type 記事種別
     * @param {Function} done 処理が完了した際に呼び出されるコールバック関数。
     * @memberOf NewsSpecHelper#
     */
    NewsSpecHelper.createArticleTestData = function(type, done) {
        var model = new ArticleModel();

        var category = _.find(Code.ARTICLE_CATEGORY_LIST, function(category) {
            return category.key === type;
        });
        var publishedAt = moment(new Date()).format("YYYY-MM-DD");
        
        model.set("type", type);
        model.set("site", category.value);
        model.set("title", "UnitTestData");
        model.set("publishedAt", publishedAt);
        model.save(null, {
            success : function(model, response, options) {
                app.logger.debug("save article model. __id: " + response.__id);
                var testDataId = response.__id;
                app.logger.debug("Success creating test article data.");
                done(testDataId);
            },
            error : function() {
                assert.ok(false, "Failed creating article data.");
                done();
            }
        });
    };

    module.exports = NewsSpecHelper;
});

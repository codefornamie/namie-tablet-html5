define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

    /**
     * 記事情報のモデルクラスを作成する。
     *
     * @class 記事情報のモデルクラス
     * @exports NewspaperHolidayModel
     * @constructor
     */
    var NewspaperHolidayModel = AbstractODataModel.extend({
        entity : "newspaper_holiday",
    });

    module.exports = NewspaperHolidayModel;
});

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Filter = require("modules/util/filter/Filter");
    var Ge = require("modules/util/filter/Ge");
    var Le = require("modules/util/filter/Le");
    var And = require("modules/util/filter/And");
    var DateUtil = require("modules/util/DateUtil");

    /**
     * 日付の範囲検索をするための式を生成するクラスを作成する。
     * 
     * @class 日付の範囲検索をするための式を生成するクラス
     * @exports BetweenDayPeriod
     * @constructor
     */
    var BetweenDayPeriod = Filter.extend({
        init : function(key, from, to, dayFormat) {
            if (!dayFormat) {
                dayFormat = "yyyy-MM-dd";
            }
            this.key = key;
            this.from = DateUtil.formatDate(from, dayFormat);
            this.fromDate = from;
            this.to = DateUtil.formatDate(to, dayFormat);
            this.toDate = to;
        }
    });
    /**
     * 日付の範囲検索を行う式を生成する。
     * 
     * @returns {String} 生成した式
     */
    BetweenDayPeriod.prototype.expression = function() {
        var ge = new Ge(this.key, this.from);
        var lt = new Le(this.key, this.to, true);
        return Filter.queryString([new And([ge, lt])]);
    };

    module.exports = BetweenDayPeriod;
});

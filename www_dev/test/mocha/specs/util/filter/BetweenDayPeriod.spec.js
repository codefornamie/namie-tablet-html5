define(function(require) {
    "use strict";
    var app = require("app");
    var Filter = require("modules/util/filter/Filter");
    var DateUtil = require("modules/util/DateUtil");
    var BetweenDayPeriod = require("modules/util/filter/BetweenDayPeriod");

    describe("BetweenDayPeriod", function() {
        it("TEST-01 BetweenDayPeriod#expression", function() {
            var today = new Date('2014/11/07');
            var aWeekBefore = DateUtil.addDay(today, -7);
            var operator = new BetweenDayPeriod("createdAt", aWeekBefore, today);
            var query = Filter.queryString([ operator ]);
            assert.equal(query, "( createdAt ge '2014-10-31' ) and ( createdAt lt '2014-11-07' )");
        });
    });
});
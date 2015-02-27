(function(define) {
    "use strict";

    define(function (require, exports, module) {
        var _ = require("underscore");
        var moment = require("moment");
        var Code = require("modules/util/Code");

        var HoribaRecordValidator = _.extend(function () {
            console.assert(typeof _ !== "undefined", "underscore should be defined");

            this.errorCode = 0;
        }, Backbone.Events);

        HoribaRecordValidator.prototype.validate = function (records) {
            return _.filter(records, this.selectValidRecord.bind(this));
        };

        HoribaRecordValidator.prototype.selectValidRecord = function (record) {
            var date = record[Code.HORIBA_TITLE_DATE];
            var hasDose = (record[Code.HORIBA_TITLE_DOSE] != null);
            var hasPosition = !!record[Code.HORIBA_TITLE_POSITION];

            // 線量が無い場合
            if (!hasDose) {
                this.errorCode |= Code.ERR_DOSE_MISSING;
            }

            // 緯度経度が無い場合
            if (!hasPosition) {
                this.errorCode |= Code.ERR_POSITION_MISSING;
            }

            // 日付が不正な場合
            if (!moment(date).isValid()) {
                this.errorCode |= Code.ERR_INVALID_DATE;
            }

            return hasDose && hasPosition;
        };

        return HoribaRecordValidator;
    });

}(
     typeof module === "object" && typeof define !== "function"
    ? function (factory) { module.exports = factory(require, exports, module); }
    : define
));

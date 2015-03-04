(function(define) {
    "use strict";

    define(function (require, exports, module) {
        // TODO 正式にCSVデータ内アップロード形式が決まった際に再度記述。現状仮。
        var _ = require("underscore");
        var Backbone = require("backbone");
        var moment = require("moment");
        var Code = require("modules/util/Code");

        /**
         * 車載線量データのアップロード用リストダイアログクラス
         *
         * @class 車載線量データのアップロード用リストダイアログクラス
         * @exports AutomotiveDosimeterRecordValidator
         * @constructor
         */
        var AutomotiveDosimeterRecordValidator = _.extend(function () {
            console.assert(typeof _ !== "undefined", "underscore should be defined");

            this.errorCode = 0;
        }, Backbone.Events);

        /**
         * hasError
         *
         * @param {Boolean} expected
         * @return {Boolean}
         */
        AutomotiveDosimeterRecordValidator.prototype.hasError = function (expected) {
            if (expected !== undefined) {
                return this.errorCode & expected;
            } else {
                return !!this.errorCode;
            }
        };

        /**
         * validate
         *
         * @param {Array} records
         * @return {Array}
         */
        AutomotiveDosimeterRecordValidator.prototype.validate = function (records) {
            var ret = _.filter(records, this.selectValidRecord.bind(this));

            if (ret.length) {
                return ret;
            } else {
                // レコードが無い場合
                this.errorCode |= Code.ERR_NO_RECORD;
                return [];
            }
        };

        /**
         * selectValidRecord
         *
         * @param {Object} record
         * @return {Boolean}
         */
        AutomotiveDosimeterRecordValidator.prototype.selectValidRecord = function (record) {
//            var time = record[Code.AUTOMOTIVE_TITLE_TIME];
            var lat = record[Code.AUTOMOTIVE_TITLE_LATITUDE];
            var long = record[Code.AUTOMOTIVE_TITLE_LONGITUDE];
//            var hasDose = record[Code.AUTOMOTIVE_TITLE_DOSE1];
            var hasPosition = lat && long;

//            // 線量が無い場合
//            if (!hasDose) {
//                this.errorCode |= Code.ERR_DOSE_MISSING;
//            }

            // 緯度経度が無い場合
            if (!hasPosition) {
                this.errorCode |= Code.ERR_POSITION_MISSING;
            }

//            // 日付が不正な場合
//            if (!moment(date).isValid()) {
//                this.errorCode |= Code.ERR_INVALID_DATE;
//            }
//
//            return hasDose && hasPosition;
        };

        return AutomotiveDosimeterRecordValidator;
    });

}(
     typeof module === "object" && typeof define !== "function" ?
        function (factory) { module.exports = factory(require, exports, module); } :
        define
));

(function(define) {
    "use strict";

    define(function (require, exports, module) {
        var _ = require("underscore");
        var Backbone = require("backbone");
        var moment = require("moment");
        var Code = require("modules/util/Code");

        /**
         * HORIBAの線量データをバリデーションするためのクラス
         *
         * @class HORIBAの線量データをバリデーションするためのクラス
         * @exports ModalRadiationListView
         * @constructor
         */
        var HoribaRecordValidator = _.extend(function () {
            console.assert(typeof _ !== "undefined", "underscore should be defined");

            this.errorCode = 0;
        }, Backbone.Events);

        /**
         * バリデーションによってエラーが出たかどうかを返す
         *
         * @memberOf HoribaRecordValidator#
         * @param {Boolean} expected
         * @return {Boolean}
         */
        HoribaRecordValidator.prototype.hasError = function (expected) {
            if (expected !== undefined) {
                return this.errorCode & expected;
            } else {
                return !!this.errorCode;
            }
        };

        /**
         * 渡されたログデータのレコード配列が正しいかどうか判定する
         *
         * @memberOf HoribaRecordValidator#
         * @param {Array} records
         * @return {Array}
         */
        HoribaRecordValidator.prototype.validate = function (records) {
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
         * 渡されたログデータのレコードが正しいかどうか判定する
         *
         * @memberOf HoribaRecordValidator#
         * @param {Object} record
         * @return {Boolean}
         */
        HoribaRecordValidator.prototype.selectValidRecord = function (record) {
            var date = record[Code.HORIBA_TITLE_DATE];
            var position = record[Code.HORIBA_TITLE_POSITION];
            var dose = record[Code.HORIBA_TITLE_DOSE];

            return this.isValid(dose, position, date);
        };

        /**
         * 渡されたログデータが正しいかどうか判定する
         *
         * @memberOf HoribaRecordValidator#
         * @param {Number} dose
         * @param {String} position
         * @param {String} date
         * @return {Boolean}
         */
        HoribaRecordValidator.prototype.isValid = function (dose, position, date) {
            var hasPosition = (
                typeof position === "string" &&
                position.split(" ").every(function (s) { return !!parseInt(s, 10); })
            );

            // 線量が無い場合
            if (!dose) {
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

            return hasPosition;
        };

        return HoribaRecordValidator;
    });

}(
     typeof module === "object" && typeof define !== "function" ?
        function (factory) { module.exports = factory(require, exports, module); } :
        define
));

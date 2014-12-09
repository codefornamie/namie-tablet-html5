define(function(require, exports, module) {
    "use strict";

    var Class = require("modules/util/Class");
    /**
     * personium.io のログレベル定義。
     * @class personium.io のログレベル定義
     * @exports PIOLogLevel
     * @constructor
     */
    var PIOLogLevel = Class.extend({
        init : function(app) {

        }
    });
    /**
     * ログ種別：ERROR
     * @memberOf PIOLogLevel#
     */
    PIOLogLevel.ERROR = "ERROR";
    /**
     * ログ種別：WARN
     * @memberOf PIOLogLevel#
     */
    PIOLogLevel.WARN = "WARN";
    /**
     * ログ種別：INFO
     * @memberOf PIOLogLevel#
     */
    PIOLogLevel.INFO = "INFO";

    module.exports = PIOLogLevel;
});

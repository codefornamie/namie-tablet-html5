define(function(require, exports, module) {
    module.exports = {
        "basic" : {
            "baseUrl" : "https://fj.baas.jp.fujitsu.com/",
            "cellId" : "kizuna01",
            "boxName" : "data",
            "odataName" : "odata",
            "pcsVersion" : "1.3.18"
        },
        "logger" : {
            "enable" : true,
            "threshold" : "DEBUG",
            "patternLayout" : "%d{yyyy/MM/dd HH:mm:ss,SSS} %c [%p] %m{1}",
            "useConsoleLog" : true
        }
    };
});
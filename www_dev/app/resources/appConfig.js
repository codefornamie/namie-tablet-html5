define(function(require, exports, module) {
    module.exports = {
        "basic" : {
            "baseUrl" : "https://fj.baas.jp.fujitsu.com/",
            "cellId" : "kizuna01",
            "boxName" : "data",
            "odataName" : "odata",
            // view category (ex. news, dojo, letter, posting, ope ..).
            "mode" : "news"
        },
        "logger" : {
            "enable" : true,
            "threshold" : "DEBUG",
            "patternLayout" : "%d{yyyy/MM/dd HH:mm:ss,SSS} %c [%p] %m{1}",
            "useConsoleLog" : true
        },
        "googleAnalytics" : {
            "trackingId" : "UA-56712876-2"
        }
    };
});

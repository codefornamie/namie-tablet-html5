define(function(require, exports, module) {
    module.exports = {
        "basic" : {
            "baseUrl" : "https://namie-tablet.jp/",
            "cellId" : "kizuna",
            "boxName" : "data",
            "odataName" : "odata",
            "retryCount" : "3",
            // view category (ex. news, dojo, letter, posting, ope ..).
            "mode" : "news"
        },
        "logger" : {
            "enable" : true,
            "threshold" : "INFO",
            "patternLayout" : "%d{yyyy/MM/dd HH:mm:ss,SSS} %c [%p] %m{1}",
            "useConsoleLog" : false
        },
        "googleAnalytics" : {
            "trackingId" : "UA-56712876-3"
        }
    };
});

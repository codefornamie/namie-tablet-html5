define(function(require, exports, module) {
    module.exports = {
        "basic" : {
            "baseUrl" : "http://test.namie-tablet.org/",
            "cellId" : "kizuna01",
            "boxName" : "data",
            "odataName" : "odata",
            "retryCount" : "3",
            // view category (ex. news, dojo, letter, rad, posting, ope ..).
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

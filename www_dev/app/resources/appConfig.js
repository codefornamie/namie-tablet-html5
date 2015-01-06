define(function(require, exports, module) {
    module.exports = {
        "basic" : {
            "baseUrl" : "https://test.namie-tablet.org/",
            "cellId" : "kizuna01",
            "boxName" : "data",
            "odataName" : "odata",
            // view category (ex. news, dojo, letter, posting, ope ..).
            "mode" : "letter"
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

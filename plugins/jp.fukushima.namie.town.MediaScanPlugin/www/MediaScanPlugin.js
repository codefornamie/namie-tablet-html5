module.exports = {
    scanFile:function(path, successCallback, failureCallback) {
        if (typeof successCallback !== "function") {
            console.log("MediaScanPlugin Error: successCallback is not a function");
        }
        else if (typeof failureCallback !== "function") {
            console.log("MediaScanPlugin Error: failureCallback is not a function");
        }
        else {
            return cordova.exec(successCallback, failureCallback, "MediaScanPlugin", "scanFile", [path]);
        }
    }
};

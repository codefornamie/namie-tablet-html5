define(function(require, exports, module) {
    "use strict";

    var FileAPIUtil = function() {

    };
    FileAPIUtil.isSupported = function() {
        return window.File && window.FileReader && window.FileList && window.Blob;
    };

    FileAPIUtil.createObjectURL = function(file) {
        console.log("createObjectURL: file: " + file);
        if (window.webkitURL) {
            console.log("window.webkitURL: true");
            return window.webkitURL.createObjectURL(file);
        } else if (window.URL && window.URL.createObjectURL) {
            console.log("window.webkitURL: false");
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    };
    FileAPIUtil.bindFileInputImpl = function(el, preview){
        var self = this;
        // 動作プラットフォーム判定
        document.addEventListener("deviceready", function(e){
            //var Camera = navigator.camera;
            console.log("deviceready!!!: " + el.attr("type"));
            console.log("Camera: " + Camera);
            el.attr("type", "button");
            el.on("click", function(e){
                var target = e.target;
                navigator.camera.getPicture(function(imageURI){
                    window.resolveLocalFileSystemURL(imageURI, function(fileEntry){
                        console.log("fileEntry:" + fileEntry);
                        var file = fileEntry.file(function(file){
                            console.log("file:" + file);
                            var evt = document.createEvent("Event");
                            evt.initEvent("change", true, true);
                            console.log("evt:" + evt);
                            target.file = file;
                            console.log("target.files: " + target.file);
                            target.dispatchEvent(evt);
                            console.log("end");
                        }, function(e){
                            alert("エラー");
                        });
                    });
                }, function(e){
                    alert("エラー");
                },{
                    quality : 50,
                    destinationType : Camera.DestinationType.FILE_URI,
                    sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                    correctOrientation : true
                });
            });
        });
    };
    FileAPIUtil.bindFileInput = function(el, preview){
        FileAPIUtil.bindFileInputImpl(el);
    };

    module.exports = FileAPIUtil;
});

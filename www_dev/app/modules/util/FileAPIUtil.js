define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    /**
     * ファイルユーティリティ
     * @class ファイルユーティリティ
     * @constructor
     */
    var FileAPIUtil = function() {

    };
    /**
     * 写真投稿ギャラリー一覧の表示最大値
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.GET_GALLERY_MAX = 8;
    /**
     * 線量データ一覧の表示最大値
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.GET_RADIATION_MAX = 25;
    /**
     * File関連のAPIまたはクラスがサポートされているかチェックを行う。
     * @return サポートの可否 true:サポートされいる false:サポートされていない
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.isSupported = function() {
        return window.File && window.FileReader && window.FileList && window.Blob;
    };

    /**
     * オブジェクトURLを生成する。
     * @param {Object} file ファイル
     * @return オブジェクトURL
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.createObjectURL = function(file) {
        app.logger.debug("createObjectURL: file: " + file);
        if (window.webkitURL) {
            app.logger.debug("window.webkitURL: true");
            return window.webkitURL.createObjectURL(file);
        } else if (window.URL && window.URL.createObjectURL) {
            app.logger.debug("window.webkitURL: false");
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    };
    /**
     * 画像ファイル読み込みを行う。
     * @param {Object} el
     * @param {Object} preview
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.bindFileInputImpl = function(el, preview) {
        var self = this;
        // 動作プラットフォーム判定
        document.addEventListener("deviceready", function(e) {
            // var Camera = navigator.camera;
            app.logger.debug("deviceready!!!: " + el.attr("type"));
            app.logger.debug("Camera: " + Camera);
            el.attr("type", "button");
            el.on("click", function(e) {
                var target = e.target;
                navigator.camera.getPicture(function(imageURI) {
                    window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
                        app.logger.debug("fileEntry:" + fileEntry);
                        var file = fileEntry.file(function(file) {
                            app.logger.debug("file:" + file);
                            var evt = document.createEvent("Event");
                            evt.initEvent("change", true, true);
                            app.logger.debug("evt:" + evt);
                            target.file = file;
                            app.logger.debug("target.files: " + target.file);
                            target.dispatchEvent(evt);
                            app.logger.debug("end");
                        }, function(e) {
                            app.logger.debug("FileAPIUtil.bindFileInputImpl: camera.getPicture(): error");
                        });
                    });
                }, function(e) {
                    app.logger.debug("FileAPIUtil.bindFileInputImpl: getPicture(): error");
                }, {
                    quality : 50,
                    destinationType : Camera.DestinationType.FILE_URI,
                    sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                    correctOrientation : true
                });
            });
        });
    };
    /**
     * 画像ファイル読み込みを行う。
     * @param {Object} el
     * @param {Object} preview
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.bindFileInput = function(el, preview) {
        FileAPIUtil.bindFileInputImpl(el);
    };
    /**
     * ギャラリー画像ファイル読み込み時、画像のリサイズをするかどうか
     */
    FileAPIUtil.IMAGE_RESIZE = true;
    /**
     * カメラで撮影した実機内ギャラリー一覧のデータを取得する
     * @param {Function} callback コールバック関数
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.getGalleryList = function(callback) {
        document.addEventListener('deviceready', function() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                var rootDirectoryEntry = fileSystem.root;
                // カメラで撮影した画像はDCIM/Camera配下にあるため、そこのディレクトリを読み込む
                rootDirectoryEntry.getDirectory("DCIM/Camera/", {
                    create : true
                }, function(directoryEntry) {
                    // ディレクトリ内のファイルを読み込むためのDirectoryReaderオブジェクトを生成
                    var directoryReader = directoryEntry.createReader();
                    // ディレクトリ内のエントリの読み込み
                    directoryReader.readEntries(function(entries) {
                        var fileArray = [];
                        var files = _.filter(entries, function(entry) {
                            return entry.isFile === true;
                        });
                        // 画像ファイルのみでフィルタする
                        files = _.filter(files, function(file) {
                            return file.name.match(/\.jpg$/i);
                        });

                        _.each(files, function(fileEntry) {
                            FileAPIUtil.getFileEntry(directoryEntry, fileEntry.name, function(file) {
                                fileArray.push(file);
                                if (fileArray.length >= files.length) {
                                    directoryEntry = null;
                                    // 画像登録日時でソートし、先頭のGET_GALLERY_MAX数件のみ配列で返却する
                                    fileArray = _.sortBy(fileArray, function(fileItem) {
                                        return -fileItem.lastModifiedDate;
                                    });
                                    // callback(fileArray.slice(0, FileAPIUtil.GET_GALLERY_MAX));
                                    // 最新８枚の画像のみにフィルタ
                                    fileArray = fileArray.slice(0, FileAPIUtil.GET_GALLERY_MAX);
                                    FileAPIUtil.setFileUrls(fileArray, function() {
                                        callback(fileArray);
                                    });
                                }
                            });
                        }.bind(this));
                        // ファイルが無い場合は空配列を返す
                        if (files.length === 0) {
                            callback(fileArray);
                        }
                    }, function(e) {
                        // readEntriesでエラー
                        app.logger.debug("FileAPIUtil.getGalleryList: readEntries(): error" + e.code);
                    });
                }, function(e) {
                    // getDirectoryでエラー
                    app.logger.debug("FileAPIUtil.getGalleryList: getDirectory(): error" + e.code);
                });
            }, function(e) {
                // requestFileSystemでエラー
                app.logger.debug("FileAPIUtil.getGalleryList: requestFileSystem(): error" + e.code);
            });
        }, false);
    };
    /**
     * HORIBA端末にて計測したデータ一覧を取得する
     * @param {Function} callback コールバック関数
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.getHoribaRadiationList = function(callback) {
        document.addEventListener('deviceready', function() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                var rootDirectoryEntry = fileSystem.root;
                // HORIBA/Rabi/配下にCSVデータがデフォルトで保存されてあるため、そこのディレクトリを読み込む
                rootDirectoryEntry.getDirectory("HORIBA/Radi/", {
                    create : true
                }, function(directoryEntry) {
                    // ディレクトリ内のファイルを読み込むためのDirectoryReaderオブジェクトを生成
                    var directoryReader = directoryEntry.createReader();
                    // ディレクトリ内のエントリの読み込み
                    directoryReader.readEntries(function(entries) {
                        var fileArray = [];
                        var files = _.filter(entries, function(entry) {
                            return entry.isFile === true;
                        });
                        // CSVファイルのみでフィルタする
                        files = _.filter(files, function(file) {
                            return file.name.match(/\.csv$/i);
                        });

                        _.each(files, function(fileEntry) {
                            fileEntry.getMetadata(function(metadata) {
                                fileEntry.lastModifiedDate = metadata.modificationTime;
                                fileArray.push(fileEntry);
                                if (fileArray.length >= files.length) {
                                    directoryEntry = null;
                                    // 更新日時でソートし、先頭のGET_RADIATION_MAX数件のみ配列で返却する
                                    fileArray = _.sortBy(fileArray, function(fileItem) {
                                        return -fileItem.lastModifiedDate;
                                    });
                                    callback(fileArray.slice(0, FileAPIUtil.GET_RADIATION_MAX));
                                }
                            }, function(err) {
                                fileArray.push({});
                                app.logger.debug("FileAPIUtil.getHoribaRadiationList: getMetadata(): error" + err.code);
                            }.bind(fileEntry));
                        }.bind(this));
                        // ファイルが無い場合は空配列を返す
                        if (files.length === 0) {
                            callback(fileArray);
                        }
                    }, function(e) {
                        // readEntriesでエラー
                        callback([]);
                        app.logger.debug("FileAPIUtil.getHoribaRadiationList: readEntries(): error" + e.code);
                    });
                }, function(e) {
                    // getDirectoryでエラー
                    callback([]);
                    app.logger.debug("FileAPIUtil.getHoribaRadiationList: getDirectory(): error" + e.code);
                });
            }, function(e) {
                // requestFileSystemでエラー
                callback([]);
                app.logger.debug("FileAPIUtil.getHoribaRadiationList: requestFileSystem(): error" + e.code);
            });
        }, false);
    };
    /**
     * 指定されたFileEntryの配列のBlobURLを生成し、FileEntryに紐づける。 FileAPIUtil.IMAGE_RESIZEプロパティが<code>true</code>の場合、
     * 画像のリサイズ処理を行い、その画像のデータを示すDataURLをFileEntryに設定する。
     * @param {Array} fileArray FileEntryの配列
     * @param {Function} onCreate fileArrayに指定されたすべてのFileEntryに対する処理が完了した際に呼び出される。
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.setFileUrls = function(fileArray, onCreate) {
        var counter = 0;

        _.each(fileArray, function(fileEntry) {
            var fileName = fileEntry.name;
            var file = fileEntry.fileObject;
            if (FileAPIUtil.getFileEntryCache[fileName]) {
                app.logger.debug("fileEntry used cache." + fileName);
                fileEntry.url = FileAPIUtil.getFileEntryCache[fileName];
                counter++;
                if (counter >= fileArray.length) {
                    onCreate();
                }
                return;
            }
            if (FileAPIUtil.IMAGE_RESIZE) {
                // png形式にしないと、リサイズ後の画像が壊れる
                file.type = "image/png";
                canvasResize(file, {
                    width : 600,
                    height : 0,
                    crop : false,
                    quality : 80,
                    // rotate: 90,
                    rotate : -1,
                    callback : $.proxy(function(fileEntry, data, width, height) {

                        fileEntry.url = data;
                        FileAPIUtil.getFileEntryCache[fileName] = fileEntry.url;
                        counter++;
                        if (counter >= fileArray.length) {
                            onCreate();
                        }
                    }, this, fileEntry)
                });
            } else {
                var reader = new FileReader();
                reader.onload = $.proxy(function(fileEntry, fileEvent) {
                    var binary = fileEvent.target.result;
                    var uint8array = new Uint8Array(binary);
                    var blob = new Blob([
                        uint8array
                    ], {
                        type : file.type
                    });
                    var url = FileAPIUtil.createObjectURL(blob);
                    fileEntry.url = url;
                    FileAPIUtil.getFileEntryCache[fileName] = fileEntry.url;
                    counter++;
                    if (counter >= fileArray.length) {
                        onCreate();
                    }
                }, this, fileEntry);
                reader.readAsArrayBuffer(file);
            }
        }.bind(this));

    };

    FileAPIUtil.getFileEntryCache = {};
    /**
     * ファイル名からfileEntryオブジェクトを取得
     * @param {Object} directoryEntry DirecotryEntryオブジェクト
     * @param {Object} fileName ファイル名
     * @param {Function} callback コールバック関数
     * @memberOf FileAPIUtil#
     */
    FileAPIUtil.getFileEntry = function(directoryEntry, fileName, callback, resize) {
        directoryEntry.getFile(fileName, null, function(fileEntry) {
            fileEntry.file(function(file) {
                // 最終更新日時を取得する
                fileEntry.lastModifiedDate = file.lastModifiedDate;
                fileEntry.fileObject = file;
                callback(fileEntry);
            }, function(e) {
                // fileでエラー
                app.logger.debug("FileAPIUtil.getFileEntry: file(): error" + e.code);
                callback(null);
            });
        }, function(e) {
            // getFileでエラー
            app.logger.debug("FileAPIUtil.getFileEntry: getFile(): error" + e.code);
            callback(null);
        });
    };

    module.exports = FileAPIUtil;
});

// Kick off the application.
require([
        "app", "router", "modules/util/VersionChecker", "modules/util/CommonUtil", "modules/util/Code"
], function(app, Router, VersionChecker, CommonUtil, Code) {
    // Cordova初期化中のCordova Plugin読み込みエラー時にalertが表示されるのを抑止する
    var _alert = window.alert;
    window.alert = function() {
    };
    var goRoute = function() {
        // アプリが起動できたことをマークする
        window.startApp = true;
        // キャッシュの有無
        app.useCache = CommonUtil.useCache(app.config.basic.mode);

        window.alert = _alert;
        // Define your master router on the application namespace and trigger all
        // navigation from this instance.
        app.router = new Router();

        // Trigger the initial route and enable HTML5 History API support, set the
        // root folder to '/' by default. Change in app.js.
        Backbone.history.start({
            pushState : true,
            root : app.root
        });

        // 新聞アプリがバックグラウンドとなった場合は、トップ画面へリロードする
        if (app.config.basic.mode === Code.APP_MODE_NEWS) {
            document.addEventListener("resume", function() {
                app.router.loginView.goNextView();
            }, false);
        }

        // 放射線アプリがバックグラウンドとなった場合は、トップ画面へリロードする
        if (app.config.basic.mode === Code.APP_MODE_RAD) {
            document.addEventListener("resume", function() {
                // 放射線アプリのTopにいる場合のみリロードする。
                if ( Backbone.history.fragment === "rad" ) {
                    app.router.radTop();
                }
            }, false);
        }
    };
    var main = function() {
        VersionChecker.check(function(result) {
            console.log("versioncheck:" + result);
            if (!result) {
                navigator.notification.alert('新しいアプリが公開されています。最新のものに更新してください。', function() {
                    window.open('https://play.google.com/store/apps/details?id=jp.fukushima.namie.town.' +
                            app.config.basic.mode, '_system');
                    navigator.app.exitApp();
                }, '通知', 'アプリ更新画面へ');
                return;
            } else {
                goRoute();
            }
        });
    };
    var deviceReadyFired = false;
    var onDeviceReady = function() {
        deviceReadyFired = true;
        console.log("cordova deviceReady.");
        console.log(window.device.cordova);
        main();
    };
    if (CommonUtil.isCordova()) {
        // Cordovaで動作している場合、Cordovaの初期化が完了するま待つ
        if (CommonUtil.isCordovaRunning()) {
            console.log("isCordovaRunning: true");
            // この処理が動作した時点ですでに初期化完了済み
            onDeviceReady();
        } else {
            console.log("isCordovaRunning: false");
            console.log("Start document.addEventListener(deviceready)");
            document.addEventListener("deviceready", onDeviceReady, false);
            setTimeout(function() {
                if (deviceReadyFired === false) {
                    onDeviceReady();
                }
            }, 5000);
        }
    } else {
        goRoute();
    }

    /**
     *  ライセンスページヘのリンクを有効化する
     */
    $(document).on("click", "[data-external-link]", function (ev) {
        var href = $(ev.target).attr("href");

        if (href) {
            window.open(href, "_system");
            ev.preventDefault();
            ev.stopImmediatePropagation();
        }
    });
});

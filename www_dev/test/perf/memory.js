/*
 * Seleniumでのテストシナリオ実行検証スクリプト
 * 
 * 起動方法(Mac):
 * $ cd www_dev/
 * $ PATH=$PATH:`npm bin` node test/perf/memory.js
 * 
 * ログファイル:
 * 「reports/perf/」以下に、「memory-(実行日時).log」というファイル名でログファイルが作成される。
 * ログには全体試行回数、繰り返し回数、日時、メモリ情報がCSV形式で出力される。
 */

var fs = require('fs');
var util = require('util');
var readline = require("readline");
var childProcess = require('child_process');
var URL = require("url");
var _ = require("underscore");
var colors = require("colors");
var mkdirp = require("mkdirp");
var moment = require("moment");

var chromedriver = require('chromedriver');
var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;
var chrome = require('selenium-webdriver/chrome');

var flow = webdriver.promise.controlFlow();

colors.setTheme({
    step: "reset",
    info: "green",
    memory: "cyan"
});

function runTest() {
    var TIMEOUT = 10000;
    var LOG_DIR = "reports/perf";
    var LOG_FILE = LOG_DIR + "/memory-" + moment().format("YYYY-MM-DDTHH-mm-ss") + ".log";

    // ログファイルの設定
    mkdirp.sync(LOG_DIR);
    fs.writeFileSync(LOG_FILE, "index,loopIndex,time,usedJSHeapSize,jsHeapSizeLimit,totalJSHeapSize\n");
    var appendLog = function (index, loopIndex) {
        driver.executeScript("return console.memory").then(function (memory) {
            var record = [
                index,
                loopIndex,
                Date.now(),
                memory.usedJSHeapSize,
                memory.jsHeapSizeLimit,
                memory.totalJSHeapSize
            ];
            var recordStr = record.join(",") + "\n";

            fs.appendFileSync(LOG_FILE, recordStr);
        });
    };

    // Chrome実行オプション
    // 詳細なメモリ情報を有効にする
    var chromeOptions = new chrome.Options();
    chromeOptions.addArguments("enable-precise-memory-info");

    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
    var navigator = driver.navigate();
    var showStep = function(description) {
        driver.executeScript("return console.memory.usedJSHeapSize").then(function (heapSize) {
            var bar = "*";
            _(~~(heapSize / (10 * 1000 * 1000))).times(function () { bar += "*"; });

            console.log(colors.memory("usedJSHeapSize: " + bar + " " + heapSize));
            console.log(colors.step(description));
        })
    };

    /*
    driver.executeScript(":takeHeapSnapshot").then(function (result) {
        fs.writeFile("heap_snapshot.json", JSON.stringify(result));
        fs.writeFile("heap_snapshot.txt", util.inspect(result));
    });
    */

    _(100).times(function (index) {
        driver.sleep(0).then(function () {console.log(colors.info("全体試行回数: " + (index + 1) + "回目"));} );

        // 1 ログインする
        driver.get('http://0.0.0.0:8000/').then(function () {showStep("1 ログインする");} );
        driver.wait(function () {
            return driver.isElementPresent(By.css('#loginId'));
        }, TIMEOUT);
        driver.wait(function () {
            return driver.findElement(By.css('#loginId')).isDisplayed();
        }, TIMEOUT);

        driver.findElement(By.css('#loginId')).sendKeys('ukedon');
        driver.findElement(By.css('#password')).sendKeys('namie01');
        driver.findElement(By.css('#loginButton')).click();

        driver.wait(function () {
          return driver.getCurrentUrl().then(function (url) {
            return URL.parse(url).pathname.match(/^\/top\/[\d-]/);
          });
        }, TIMEOUT);
        
        // ヒープスナップショットを取得するプロンプトを表示
        waitTakingHeapSnapshot();

        //   3秒間、間隔をあける
        driver.sleep(3000);

        //   以下を10回繰り返す
        _(10).times(function (loopIndex) {
            driver.sleep(0).then(function () {
                console.log(colors.info("繰り返し回数: " + (loopIndex + 1) + "回目"));
                showStep("2 初期画面（記事一覧）を表示する");
            });

            // 2 初期画面（記事一覧）を表示する

            //   3秒間、間隔をあける
            driver.sleep(3000).then(function () {showStep("3 記事を選択し、記事詳細画面を表示する");} );

            // 3 記事を選択し、記事詳細画面を表示する
            //   要素を抽出しランダムで選びクリックさせる
            driver.wait(function () {
                return driver.isElementPresent(By.css(".grid-list__item"));
            }, TIMEOUT);
            driver.findElements(By.css(".grid-list__item")).then(function(elements) {
                _.sample(elements).click();
            });

            driver.wait(function () {
                return driver.getCurrentUrl().then(function (url) {
                  return URL.parse(url).pathname.match(/^\/top\/[\d-]+\/article\/.+/);
                });
            }, TIMEOUT);

            //  10秒間、間隔をあける
            driver.sleep(10000).then(function () {showStep("4 記事一覧に戻る(記事一覧画面を表示する)");} );

            // 4 記事一覧に戻る(記事一覧画面を表示する)
            navigator.back();

            driver.wait(function () {
                return driver.getCurrentUrl().then(function (url) {
                  return URL.parse(url).pathname.match(/^\/top\/[\d-]/);
                });
              }, TIMEOUT);

            //   3秒間、間隔をあける
            driver.sleep(3000).then(function () {showStep("5 過去記事を選択するためカレンダーを表示する");} );

            // 5 過去記事を選択するためカレンダーを表示する
            driver.wait(function () {
                return driver.isElementPresent(By.css('#calendar'));
            }, TIMEOUT);
            driver.findElement(By.css('#calendar')).click();

            //   3秒間、間隔をあける
            driver.sleep(3000).then(function () {showStep("6 過去記事を選択し、記事一覧を表示する");} );

            driver.wait(function () {
                return driver.isElementPresent(By.css('#modal-calendar'));
            }, TIMEOUT);

            // 6 過去記事を選択し、記事一覧を表示する
            //   選択可能な日付を抽出しランダムで選びクリックさせる
            driver.findElements(By.css(".rd-day-body:not(.rd-day-selected):not(.rd-day-disabled):not(.rd-day-prev-month):not(:last-child)")).then(function(elements) {
                _.sample(elements).click();
            });

            //   3秒間、間隔をあける
            driver.sleep(3000).then(function () {showStep("7 記事を選択し、記事詳細画面を表示する");} );

            // 7 記事を選択し、記事詳細画面を表示する
            //   2番目の項目をクリックする
            driver.wait(function () {
                return driver.isElementPresent(By.css(".grid-list__item"));
            }, TIMEOUT);
            driver.findElements(By.css(".grid-list__item")).then(function(elements) {
                elements[1].click();
            });

            driver.wait(function () {
                return driver.getCurrentUrl().then(function (url) {
                  return URL.parse(url).pathname.match(/^\/top\/[\d-]+\/article\/.+/);
                });
            }, TIMEOUT);

            //  10秒間、間隔をあける
            driver.sleep(10000).then(function () {
                console.log(colors.info("繰り返し終了"));
                appendLog(index, loopIndex);
            });

            // ループ終了：記事一覧画面を表示する
            navigator.back().then(function () {showStep("2 初期画面（記事一覧）を表示する");} );

            driver.wait(function () {
                return driver.getCurrentUrl().then(function (url) {
                  return URL.parse(url).pathname.match(/^\/top\/[\d-]/);
                });
            }, TIMEOUT);
        });
    });

    driver.quit();
}

// ヒープスナップショットを取得するプロンプトを表示
function waitTakingHeapSnapshot() {
    flow.execute(function () {
        var d = webdriver.promise.defer();

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Chromeの開発者ツールからHeapSnapshotを取得し、保存してください。完了したら開発者ツールを閉じて、Enterキーを押下してください: ", function () {
            rl.close();
            d.fulfill();
            console.log("処理を続行します");
        });
        
        return d.promise;
    });
}

chromedriver.start();
runTest(); 
chromedriver.stop();

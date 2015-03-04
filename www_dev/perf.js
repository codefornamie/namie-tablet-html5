/*
 * Seleniumでのテストシナリオ実行検証スクリプト
 * 
 * 起動方法(Mac):
 * $ cd www_dev/
 * $ PATH=$PATH:`npm bin` node perf.js
 */

var chromedriver = require('chromedriver');
var URL = require("url");

function runTest() {
    var webdriver = require('selenium-webdriver');
    var By = require('selenium-webdriver').By;
    var until = require('selenium-webdriver').until;
    var TIMEOUT = 10000;

    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
    var navigator = driver.navigate();

    driver.get('http://0.0.0.0:8000/').then(function () {console.log(1);} );
    // 1 ログインする
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

    //   3秒間、間隔をあける
    driver.sleep(3000).then(function () {console.log(2);} );

    // 2 初期画面（記事一覧）を表示する

    //   3秒間、間隔をあける
    driver.sleep(3000).then(function () {console.log(3);} );

    // 3 記事を選択し、記事詳細画面を表示する
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
    driver.sleep(10000).then(function () {console.log(4);} );

    // 4 記事一覧に戻る(記事一覧画面を表示する)
    navigator.back();

    driver.wait(function () {
        return driver.getCurrentUrl().then(function (url) {
          return URL.parse(url).pathname.match(/^\/top\/[\d-]/);
        });
      }, TIMEOUT);

    //   3秒間、間隔をあける
    driver.sleep(3000).then(function () {console.log(5);} );

    // 5 過去記事を選択するためカレンダーを表示する
    driver.wait(function () {
        return driver.isElementPresent(By.css('#calendar'));
    }, TIMEOUT);
    driver.findElement(By.css('#calendar')).click();

    //   3秒間、間隔をあける
    driver.sleep(3000).then(function () {console.log(6);} );

    // 6 過去記事を選択し、記事一覧を表示する
    //   前の月の最初の月曜日をクリックさせる
    driver.findElement(By.css('.rd-back')).click();
    driver.findElements(By.css(".rd-day-body:not(.rd-day-prev-month):first-child")).then(function(elements) {
        elements[0].click();
    });

    //   3秒間、間隔をあける
    driver.sleep(3000).then(function () {console.log(7);} );

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
    driver.sleep(10000);

    driver.quit();
}

chromedriver.start();
runTest(); 
chromedriver.stop();

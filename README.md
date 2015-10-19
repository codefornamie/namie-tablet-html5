# なみえタブレットアプリ
====================

「浪江町きずな再生支援タブレット事業」で開発したタブレットアプリケーションです。

## 必要バージョン
-----------------------
* Node v4.2.x
* NPM v3.3.x

## セットアップ手順
-----------------------
インストールには [Node.js](http://nodejs.org)  が必要です。
あらかじめインストールしておいてください。
以下、セットアップ手順を記載します。

### 1. リポジトリをクローンします。
```
git clone https://bitbucket.org/codefornamie/namie-tablet-html5.git
```
※上記コマンドを実行するために、PCに、[git クライアント](http://msysgit.github.io/)のインストールが必要です。
### 2. カレントディレクトリを変更します。
```
cd namie-tablet-html5/www_dev/
```
### 3. Node.jsのgruntとbowerパッケージをグローバルインストールします。
```
npm install -g grunt-cli bower
```
### 4. Node.jsのパッケージをインストールします。
```
npm install
```
### 5. ライブラリをインストールします。
```
bower install
```

## 実行
-----------------------
このリポジトリのソースで、以下のアプリを動作させることができます。

* なみえ新聞 (タブレット用アプリ)
* なみえ写真投稿 (タブレット用アプリ)
* なみえタブレット道場 (タブレット用アプリ)
* なみえ放射線情報 (タブレット用アプリ)
* なみえ新聞ライター (PC用アプリ)
* 浪江町アプリ管理ツール (PC用アプリ)

### 1. アプリを実行する前に、どのアプリの動作させるか、設定ファイルで指定します。
#### 設定ファイル
```
namie-tablet-html5/www_dev/app/resources/appConfig.js
```
### 2. 動作モードの指定
mode プロパティに文字列を指定します。
```
    module.exports = {
        "basic" : {
            "baseUrl" : "https:///fj.baas.jp.fujitsu.com/",
            "cellId" : "kizuna",
            "boxName" : "data",
            "odataName" : "odata",
            "retryCount" : "3",
            // view category (ex. news, dojo, letter, rad, posting, ope ..).
            "mode" : "news"
```

* なみえ新聞
"news" と指定します。
* なみえ写真投稿
"letter" と指定します。
* なみえタブレット道場
"dojo" と指定します。
* なみえ放射線情報
"rad" と指定します。
* なみえ新聞ライター
"posting"と指定します
* 浪江町アプリ管理ツール
"ope"と指定します

### 3. grunt serverタスクを実行します
```
cd namie-tablet-html5/www_dev
grunt server
```
### 4. ブラウザで、http://127.0.0.1:8000/ を表示します。
設定ファイルで指定したタブレットアプリが動作します。

## ビルド
-----------------------
gruntのデフォルトタスクを実行します。

```
grunt
```
以下のタスクが実施されます。

* jshint
JSHintによるソース解析
* jsdoc
JSDocの生成
* plato
ソフトウェアメトリクスレポートを作成
* processhtml
index.htmlをリリース用に変換
* copy
成果物をwwwフォルダにコピー
* requirejs
RequireJSのr.jsを利用してソースを最適化
* cssmin
スタイルシートの最適化

## テスト実行
-----------------------
namie-tablet-html5/www_dev フォルダをカレントにして、grunt karma:runタスクを実行します

```
grunt karma:run
```
Mocha と Chai によってテストが実行され、reports/testフォルダにテスト結果が、coverageフォルダにカバレッジレポートが出力されます。

## HTML5アプリモジュール生成
namie-tablet-html5/www_dev フォルダをカレントにして、grunt コマンドを実行します

```
grunt
```
wwwフォルダ配下にHTML5モジュール(index.html, js, css)が出力されます。

## Android apk作成
-----------------------
namie-tablet-html5/cordova フォルダ配下に、各タブレットアプリ用のCordovaプロジェクトが格納されています。

* なみえ新聞
namie-tablet-html5/cordova/news/
* なみえ写真投稿
namie-tablet-html5/cordova/letter/
* なみえタブレット道場
namie-tablet-html5/cordova/dojo/
* なみえ放射線情報
namie-tablet-html5/cordova/rad/

### 1. 設定ファイル(namie-tablet-html5/www_dev/app/resources/appConfig.js)のmodeプロパティの文字列を、動作させるアプリの値に設定します
### 2. Cordovaプロジェクトをカレントディレクトリにして、cordovaコマンドを実行します
```
cordova build
```
## Android実機で動作
-----------------------
### 1. AndroidをUSBケーブルでPCにつなぎます
### 2. カレントディレクトリを上記のアプリのCordovaプロジェクトのディレクトリにします
### 3. cordovaコマンドを実行します
```
cordova run android
```
## HTML5アプリのビルドと、Cordova ビルド実行
namie-tablet-html5/run_android.sh を実行することで、HTML5アプリのビルドとCordova build、Androidへのapk転送までが実施されます。
```
cd namie-tablet-html5
run_android.sh
```
テストをスキップして実行したい場合、以下のパラメタをつけます
```
run_android.sh skipTests
```

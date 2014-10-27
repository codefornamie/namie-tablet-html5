# 波江タブレットアプリ
====================

「浪江町きずな再生支援タブレット事業」で開発したタブレットアプリケーションです。

## セットアップ手順

インストールには [Node.js](http://nodejs.org)  が必要です。
あらかじめインストールしておいてください。
Node.js の動作確認バージョンは、0.10.32 です。
以下、セットアップ手順を記載します。

### 1. リポジトリをクローンします。
```
https://bitbucket.org/codefornamie/namie-tablet
```
※上記コマンドを実行するために、PCに、[git クライアント](http://msysgit.github.io/)のインストールが必要です。
### 2. カレントディレクトリを変更します。
```
cd namie-tablet/www_dev/
```
### 3. Node.jsのgruntとbowerパッケージをグローバルインストールします。
```
npm install -g grunt-cli bower
```
### 4. Node.jsパッケージをインストールします。
```
npm install
```
### 5. ライブラリをインストールします。
```
bower install
```

## 実行

### namie-tablet/www_dev フォルダをカレントにして、grunt serverタスクを実行します
```
grunt server
```
### ブラウザで、http://127.0.0.1:8000/ を表示します。
## ビルド
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
* styles  
分割されたスタイルシートの結合
* cssmin  
スタイルシートの最適化

## テスト実行
namie-tablet/www_dev フォルダをカレントにして、grunt karma:runタスクを実行します

```
grunt karma:run
```
Mocha と Chai によってテストが実行され、reports/testフォルダにテスト結果が、coverageフォルダにカバレッジレポートが出力されます。

## HTML5アプリモジュール生成
namie-tablet/www_dev フォルダをカレントにして、grunt コマンドを実行します

```
grunt
```
wwwフォルダ配下にHTML5モジュール(index.html, js, css)が出力されます。

## Android apk作成
namie-tablet フォルダをカレントにして、cordovaコマンドを実行します

```
cordova build
```
## Android実機で動作
AndroidをUSBケーブルでPCにつないで、cordovaコマンドを実行します

```
cordova run android
```

## HTML5アプリのビルドと、Cordova ビルド実行
namie-tablet/run_android.sh を実行することで、HTML5アプリのビルドとCordova build、Androidへのapk転送までが実施されます。


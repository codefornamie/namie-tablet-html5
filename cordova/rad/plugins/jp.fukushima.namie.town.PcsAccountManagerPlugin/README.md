# cordova-plugin-pcs-accountmanager

This plugin hold the account information of the PCS using the AccountManager of android platform.

## Install
プラグインのインストール
```bash
cordova plugin add https://bitbucket.org/codefornamie/cordova-plugin-pcs-accountmanager.git
```

## Example
確認用のCordovaプロジェクトを作成して実行する。

### Create cordova project
プロジェクトの作成
```bash
cordova create accountmanager-sample-project
cd accountmanager-sample-project
```
### Add platform
プラットフォームの追加  
Anddoroidのみ対応
```bash
cordova platform add android
```

### Install plugin
プラグインのインストール
```bash
cordova plugin add https://bitbucket.org/codefornamie/cordova-plugin-pcs-accountmanager.git
```

### Edit source
確認用のロジックを追加  
例）  
www/js/index.js を編集して 'deviceready' イベントハンドラに以下の処理を追加する

```javascript
  var am = window.plugins.accountmanager;

  // Add account
  am.addAccountExplicitly('jp.fukushima.namie.town.Pcs', 'test', 'password', {email: 'test@testdomain.com'},
      function(error, account) {
      		if (error) {
      				alert('ERROR: ' + error);
      				return;
      		}
      });

  // Get account
  am.getAccountsByType('jp.fukushima.namie.town.Pcs',
      function(error, accounts) {
      		if (error) {
      				alert('ERROR: ' + error);
      				return;
      		}
      		else if(!accounts || !accounts.length) {
      				alert('This device has no accounts');
      				return;
      		}

      		alert('#' + accounts.length + ' ACCOUNTS ON THIS DEVICE');
          accounts.forEach(function(account) {
              alert('Account: ' + JSON.stringify(account));
              // Get password
              am.getPassword(account, function(error, password) {
                  alert("password: " + password);
              });

              // Get/Set user data
              am.setUserData(account, 'age', 30);
              am.getUserData(account, 'age', function(error, age) {
                  alert(age + 'years old');
              });
          });
        });
```

### Run
実機にて動作確認
```bash
cordova run android
```

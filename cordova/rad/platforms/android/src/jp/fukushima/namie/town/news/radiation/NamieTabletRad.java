/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package jp.fukushima.namie.town.news.radiation;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;

import org.apache.cordova.*;

public class NamieTabletRad extends CordovaActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }

    /**
     * 受信エラーが発生した場合に呼び出される。
     */
    @Override
    public void onReceivedError(int errorCode, String description, String failingUrl) {
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(this);

        // ダイアログの設定
        alertDialog.setTitle("なみえ放射線情報");
        alertDialog.setMessage("アプリケーションを表示できませんでした。電波状態を見直して、起動し直してください。");
        alertDialog.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
            }
        });

        // ダイアログの作成と表示
        alertDialog.create();
        alertDialog.show();
    }
}

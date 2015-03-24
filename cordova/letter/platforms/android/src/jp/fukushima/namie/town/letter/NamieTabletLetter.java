/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package jp.fukushima.namie.town.letter;

import org.apache.cordova.CordovaActivity;

import android.os.Bundle;
import android.os.Handler;

public class NamieTabletLetter extends CordovaActivity {
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
    public void onReceivedError(int errorCode, String description,
            String failingUrl) {
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                displayError("なみえ写真投稿",
                        "アプリケーションを表示できませんでした。電波状態を見直して、起動し直してください。", "OK", true);
            }
        }, 3000);
    }
}

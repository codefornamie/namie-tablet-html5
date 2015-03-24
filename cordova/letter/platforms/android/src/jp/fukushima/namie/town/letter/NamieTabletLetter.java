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

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.app.FragmentManager;
import android.content.DialogInterface;
import android.os.Bundle;

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
        FragmentManager fm = getActivity().getFragmentManager();
        AlertFragment af = new AlertFragment();
        af.show(fm, "alert_dialog");
    }
}

class AlertFragment extends DialogFragment {
    private DialogInterface.OnClickListener okListener = new DialogInterface.OnClickListener() {
        public void onClick(DialogInterface dialog, int id) {
            getActivity().finish();
        }
    };

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("なみえ写真投稿")
                .setMessage("アプリケーションを表示できませんでした。電波状態を見直して、起動し直してください。")
                .setPositiveButton("OK", okListener);
        return builder.create();
    }
}
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
package jp.fukushima.namie.town.news;

import android.util.Log;
import android.service.dreams.DreamService;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

public class NamieJavaScriptInterface {
    /** WebViewのインスタンス。 */
    private WebView webview = null;

    /**
     * コンストラクタ。
     * @param web WebViewオブジェクト
     */
    public NamieJavaScriptInterface(WebView web) {
        webview = web;
    }

    /**
     * WebView内で動作しているJavaScriptから呼び出される。
     */
    @JavascriptInterface
    public void jsToJava() {
        final String script = "javascript:window.javaToJs('%s');";
        PersoniumModel pcs = new PersoniumModel();
        pcs.readRecentArticle(webview.getContext());
        webview.loadUrl(String.format(script, pcs.getAuthToken(webview.getContext())));
    }

    @JavascriptInterface
    public void closeDreamService() {
        Log.e("closeDreamService","closeDreamService");
        ((DreamService)webview.getContext()).finish();
    }
}

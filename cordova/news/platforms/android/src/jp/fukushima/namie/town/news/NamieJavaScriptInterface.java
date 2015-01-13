/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
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

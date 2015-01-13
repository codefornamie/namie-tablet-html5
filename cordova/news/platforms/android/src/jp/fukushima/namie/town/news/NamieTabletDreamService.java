package jp.fukushima.namie.town.news;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.service.dreams.DreamService;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

@SuppressLint("SetJavaScriptEnabled")
public class NamieTabletDreamService extends DreamService {
    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();

        setInteractive(true);
        setFullscreen(true);

        // WebView構築
        WebView webView = new WebView(this);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        setContentView(webView);

        webView.setWebViewClient(new LinkLauncher());

        // JavaScriptから呼び出されるI/Fクラスを設定
        NamieJavaScriptInterface jsif = new NamieJavaScriptInterface(webView);
        webView.addJavascriptInterface(jsif, "appJsInterface");

        // ページを表示
        webView.loadUrl("file:///android_asset/www/daydream.html");
    }

    private class LinkLauncher extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
            return true;
        }
    }
}

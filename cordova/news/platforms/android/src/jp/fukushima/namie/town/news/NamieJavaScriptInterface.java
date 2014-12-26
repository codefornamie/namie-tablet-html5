/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.io.IOException;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.accounts.AccountManagerFuture;
import android.accounts.AuthenticatorException;
import android.accounts.OperationCanceledException;
import android.os.Bundle;
import android.util.Log;
import android.service.dreams.DreamService;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

public class NamieJavaScriptInterface {
    private static final String TAG = "NamieNewspaper";
    private static final String ACCOUNT_TYPE = "jp.fukushima.namie.town.Pcs";

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
        webview.loadUrl(String.format(script, getAuthToken()));
    }

    /**
     * アカウントマネージャからアクセストークンを取得する。
     * @return アクセストークン
     */
    private String getAuthToken() {
        AccountManager manager = AccountManager.get(webview.getContext());

        Account[] accountList = manager.getAccountsByType(ACCOUNT_TYPE);
        if (accountList.length == 0) {
            // Account is not exists.
            Log.e(TAG, "THIS DEVICE HAS NO ACCOUNT.");
            return null;
        }

        Account account = accountList[0];
        Bundle options = new Bundle();
        AccountManagerFuture<Bundle> future = manager.getAuthToken(
                        account,
                        ACCOUNT_TYPE,
                        options,
                        true, null, null);

        try {
            Bundle ret = future.getResult();
            String errorCode = ret.getString(AccountManager.KEY_ERROR_CODE);
            if (errorCode != null) {
                Log.e(TAG, "getAuthToken() FAILED.");
                return null;
            } else {
                String accessToken = ret.getString(AccountManager.KEY_AUTHTOKEN);
                Log.e(TAG, "TOKEN=" + accessToken);
                manager.invalidateAuthToken(ACCOUNT_TYPE, accessToken);
                return accessToken;
            }
        } catch (OperationCanceledException e) {
            Log.e(TAG, e.getMessage());
            return null;
        } catch (AuthenticatorException e) {
            Log.e(TAG, e.getMessage());
            return null;
        } catch (IOException e) {
            Log.e(TAG, e.getMessage());
            return null;
        }
    }

    @JavascriptInterface
    public void closeDreamService() {
        Log.e("closeDreamService","closeDreamService");
        ((DreamService)webview.getContext()).finish();
    }
}

/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import com.fujitsu.dc.client.DaoException;
import com.fujitsu.dc.client.DcContext;
import com.fujitsu.dc.client.ODataCollection;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.accounts.AccountManagerFuture;
import android.accounts.AuthenticatorException;
import android.accounts.OperationCanceledException;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;

public class PersoniumModel {
    private static final String TAG = "NamieNewspaper";
    private static final String ACCOUNT_TYPE = "jp.fukushima.namie.town.Pcs";
    AccountManager manager = null;
    Account account = null;
    DcContext dc = null;

    /**
     * 指定した日付が土日か判定する。
     * @param cal Calendar
     * @return 土曜日または日曜日ならばtrue、それ以外ならばfalseを返却する
     */
    private boolean isSaturdayOrSunday(Calendar cal) {
        Log.d(TAG, "start isSaturdayOrSunday");
        int week = cal.get(Calendar.DAY_OF_WEEK);
        Log.d(TAG, "Week is : " + week);
        if ((week == 1) || (week == 7)) {
            return true;
        }
        return false;
    }

    /**
     * AccountManagerからPersonium接続情報を取得し、Perosoniumの認証を行う。
     * @param context コンテキスト
     * @return ODataコレクション
     */
    private ODataCollection initializePersonium(Context context) {
        Log.d(TAG, "start initializePersonium");
        fetchAccountManager(context);
        String token = getAuthToken(context);
        String baseUrl = manager.getUserData(account, "baseUrl");
        String cellName = manager.getUserData(account, "cellName");
        String boxName = manager.getUserData(account, "boxName");

        Log.d(TAG, "token : " + token);
        Log.d(TAG, "baseUrl : " + baseUrl);
        Log.d(TAG, "cellName : " + cellName);
        Log.d(TAG, "bxoName :" + boxName);

        dc = new DcContext(baseUrl, cellName, "", boxName);
        ODataCollection odata = null;
        try {
            odata = dc.withToken(token).cell().box().odata("odata");
        } catch (DaoException e) {
            Log.d(TAG, "personium failure : " + e.getMessage());
            return null;
        }
        return odata;
    }

    /**
     * Personiumから発行時刻の取得を行う。
     * @param odata ODataコレクション
     * @return 発行時刻のCalendarオブジェクト
     */
    private Calendar getPublishTime(ODataCollection odata) {
        Log.d(TAG, "start getPublishTime");
        HashMap<String, Object> json;
        Calendar publishTime = Calendar.getInstance();
        try {
            json = odata.entitySet("configuration").retrieveAsJson("PUBLISH_TIME");
        } catch (DaoException e) {
            Log.w(TAG, "configuration.PUBLISH_TIME not defined : " + e.getMessage());
            return null;
        }
        String timeStr = (String) json.get("value");
        Log.d(TAG, "publishTime : " + timeStr);
        String[] timeAry = timeStr.split(":");
        int hour = Integer.valueOf(timeAry[0]);
        int minute = Integer.valueOf(timeAry[1]);
        publishTime.set(Calendar.HOUR_OF_DAY, hour);
        publishTime.set(Calendar.MINUTE, minute);
        return publishTime;
    }

    /**
     * 指定した日付が新聞休刊日かチェックする。
     * @param odata ODataコレクション
     * @param cal Calendar
     * @return 休刊日の場合true、それ以外はfalseを返却
     */
    private boolean isNewspaperHoliday(ODataCollection odata, Calendar cal) {
        Log.d(TAG, "start isNewspaperHoliday");
        HashMap<String, Object> json = null;
        String date = String.format("%1$tY-%1$tm-%1$td", cal);
        Log.d(TAG, "newspaper_holiday key : " + date);
        try {
            json = odata.entitySet("newspaper_holiday").retrieveAsJson(date);
        } catch (DaoException e) {
            Log.d(TAG, "NewsPapgerHoliday not defined : " + e.getMessage());
            // 指定した日付のnewspaper_holidayが定義されていなければ休刊日ではない
            return false;
        }
        String deletedAt = (String) json.get("deletedAt");
        if ((deletedAt == null) || (deletedAt.equals(""))) {
            // newspaper_holiday が定義されていて、論理削除されていなければ休刊日
            Log.d(TAG, "newspaper_holiday defined and deletedAt not defined");
            return true;
        }
        // newspaper_holiday が定義されているが、論理削除されている場合は休刊日ではない
        Log.d(TAG, "newspaper_holiday defined but deletedAt is defined");
        return false;
    }

    /**
     * 新着記事の１件目を取得する。
     * @param odata ODataコレクション
     * @return 最新記事
     */
    @SuppressWarnings("unchecked")
    private String readRecentArticle(ODataCollection odata) {
        Log.d(TAG, "start readRecentArticle");
        Calendar now = Calendar.getInstance();
        HashMap<String, Object> json = null;
        String date = String.format("%1$tY-%1$tm-%1$td", now);
        String filter = "publishedAt eq '" + date + "' and isDepublish eq null";
        Log.d(TAG, "personium query : " + filter);
        try {
            json = odata.entitySet("article").query().top(1).orderby("createdAt desc").filter(filter).run();
        } catch (DaoException e) {
            Log.d(TAG, "personium request failure : " + e.getMessage());
            return null;
        }
        Log.d(TAG, json.toString());
        HashMap<String, Object> d = (HashMap<String, Object>) json.get("d");
        List<Object> results = (List<Object>) d.get("results");
        String ret = null;
        if ((results != null) && (results.size() > 0)) {
            ret = ((HashMap<String, Object>) results.get(0)).toString();
            Log.d(TAG, "recent article : " + ret);
        }
        Log.d(TAG, "end readRecentArticle : " + ret);
        return ret;
    }

    /**
     *
     * @param context
     * @return
     */
    public String readRecentArticle(Context context) {
        Log.d(TAG, "start readRecentAtricle");
        Calendar now = Calendar.getInstance();
        // 土曜日または日曜日ならば新聞発行なし
        if (isSaturdayOrSunday(Calendar.getInstance())) {
            Log.d(TAG, "Today is SATURDAY or SUNDAY");
            return null;
        }

        // Perosonium接続
        ODataCollection odata = initializePersonium(context);
        if (odata == null) {
            Log.w(TAG, "perosonium initialize error");
            return null;
        }

        // 既読情報をチェック

        // 発行時刻の取得
        Calendar publishTime = getPublishTime(odata);
        if (publishTime == null) {
            return null;
        }

        // 現時刻と発行時刻のチェック
        if (now.compareTo(publishTime) != 1) {
            Log.d(TAG, "now < publishTime");
            return null;
        }

        // 休刊日情報のチェック
        boolean isHoliday = isNewspaperHoliday(odata, now);
        if (isHoliday) {
            // 休刊日
            return null;
        }

        // 今日の発行記事があるかチェック
        String recentArticle = readRecentArticle(odata);
        Log.d(TAG, "end readRecentArticle");
        return recentArticle;
    }


    private void fetchAccountManager(Context context) {
        manager = AccountManager.get(context);
        Account[] accountList = manager.getAccountsByType(ACCOUNT_TYPE);
        if (accountList.length == 0) {
            // Account is not exists.
            Log.e(TAG, "THIS DEVICE HAS NO ACCOUNT.");
        }
        account = accountList[0];
    }
    /**
     * アカウントマネージャからアクセストークンを取得する。
     * @return アクセストークン
     */
    public String getAuthToken(Context context) {
        Log.d(TAG, "start getAuthToken");
        if ((manager == null) || (account == null)) {
            fetchAccountManager(context);
        }
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
}
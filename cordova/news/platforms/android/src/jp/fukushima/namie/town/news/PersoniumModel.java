/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fujitsu.dc.client.DaoException;
import com.fujitsu.dc.client.DavCollection;
import com.fujitsu.dc.client.DcContext;
import com.fujitsu.dc.client.ODataCollection;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.accounts.AccountManagerFuture;
import android.accounts.AuthenticatorException;
import android.accounts.OperationCanceledException;
import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;

public class PersoniumModel {
    private static final String TAG = "NamieNewspaper";
    private static final String ACCOUNT_TYPE = "jp.fukushima.namie.town.Pcs";
    private static final int RECOMMEND_FETCH_NUM = 1;
    AccountManager manager = null;
    Account account = null;
    DcContext dc = null;
    String userName = "";

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
        if (account == null) {
            Log.d(TAG, "personium failure : account not exists.");
            return null;
        }

        String token = getAuthToken(context);
        String baseUrl = manager.getUserData(account, "baseUrl");
        String cellName = manager.getUserData(account, "cellName");
        String boxName = manager.getUserData(account, "boxName");
        userName = account.name;

        Log.d(TAG, "userName : " + userName);
        Log.d(TAG, "token : " + token);
        Log.d(TAG, "baseUrl : " + baseUrl);
        Log.d(TAG, "cellName : " + cellName);
        Log.d(TAG, "bxoName :" + boxName);

        dc = new DcContext(baseUrl, cellName, "", boxName);
        DcContext.setPlatform("android");
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
        String date = formatDate(cal);
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
        String date = formatDate(now);
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
     * おすすめ記事の一覧を取得する。
     * @param odata ODataコレクション
     * @return おすすめ記事一覧
     */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> readRecommendArticle(ODataCollection odata) {
        Log.d(TAG, "start readRecommendArticle");
        List<Map<String, Object>> articles = new ArrayList<Map<String, Object>>();

        Calendar now = Calendar.getInstance();
        // 発行時刻の取得
        Calendar publishTime = getPublishTime(odata);
        if (publishTime == null) {
            return null;
        }
        // 現時刻と発行時刻のチェック
        if (now.before(publishTime)) {
            Log.d(TAG, "now < publishTime");
            now.roll(Calendar.DAY_OF_MONTH, false);
        }
        String date = formatDate(now);

        Map<String, Object> json = null;
        String filter = "publishedAt eq '" + date + "' and isRecommend eq 'true' and isDepublish eq null";
        Log.d(TAG, "personium query : " + filter);
        try {
            json = odata.entitySet("article").query().top(RECOMMEND_FETCH_NUM).orderby("createdAt desc").filter(filter).run();
        } catch (DaoException e) {
            Log.d(TAG, "personium request failure : " + e.getMessage());
            return null;
        }
        Log.d(TAG, json.toString());

        Map<String, Object> d = (Map<String, Object>) json.get("d");
        List<Object> results = (List<Object>) d.get("results");
        if ((results != null) && (results.size() > 0)) {
            for (Object article : results) {
                articles.add((Map<String, Object>) article);
            }
        }
        Log.d(TAG, "end readRecommendArticle : " + articles.size());
        return articles;
    }

    @SuppressWarnings("unchecked")
    private boolean isAlreadyRead(ODataCollection odata) {
        Log.d(TAG, "start isAllreadyread");
        Calendar now = Calendar.getInstance();
        String nowStr = formatDate(now);

        HashMap<String, Object> json = null;
        try {
            json = odata.entitySet("personal").query().top(1).filter("loginId eq '" + userName + "'").run();
        } catch (DaoException e) {
            Log.d(TAG, "personium personal entity query failure : " + e.getMessage());
            return true;
        }
        Log.d(TAG, json.toString());
        HashMap<String, Object> d = (HashMap<String, Object>) json.get("d");
        List<Object> results = (List<Object>) d.get("results");
        String ret = null;
        if ((results != null) && (results.size() > 0)) {
            HashMap<String, Object> item = (HashMap<String, Object>) results.get(0);
            String showLastPublished = (String) item.get("showLastPublished");
            if (showLastPublished.equals(nowStr)) {
                Log.d(TAG, "now equals showLastPublished");
                return true;
            }
        }
        Log.d(TAG, "un readed : " + ret);
        return false;
    }

    @SuppressLint("DefaultLocale")
    private String formatDate(Calendar date) {
        return String.format("%1$tY-%1$tm-%1$td", date);
    }

    /**
     *
     * @param context
     * @return
     */
    public String readRecentArticle(Context context) {
        Log.d(TAG, "start readRecentAtricle");
        Calendar now = Calendar.getInstance();

        // Perosonium接続
        ODataCollection odata = initializePersonium(context);
        if (odata == null) {
            Log.w(TAG, "perosonium initialize error");
            return null;
        }

        // 既読情報をチェック
        boolean isAllreadyread = isAlreadyRead(odata);
        if (isAllreadyread == true) {
            Log.d(TAG, "AllReady read");
            return null;
        }

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
        Log.d(TAG, "end readRecentArticle : " + recentArticle);
        return recentArticle;
    }

    public List<Map<String, Object>> readRecommendArticles(Context context) {
        Log.d(TAG, "start readRecommendArticle");

        // Perosonium接続
        ODataCollection odata = initializePersonium(context);
        if (odata == null) {
            Log.w(TAG, "perosonium initialize error");
            return null;
        }

        // おすすめ記事取得
        List<Map<String, Object>> articles = readRecommendArticle(odata);
        Log.d(TAG, "end readRecommendArticle");
        return articles;
    }

   /**
    *
    * @param context
    * @return
    */
   public boolean isArticleReaded(Context context) {
       Log.d(TAG, "start isArticleReaded");

       // Perosonium接続
       ODataCollection odata = initializePersonium(context);
       if (odata == null) {
           Log.w(TAG, "perosonium initialize error");
           return false;
       }

       // 既読情報をチェック
       boolean isAlreadyRead = isAlreadyRead(odata);
       if (isAlreadyRead == true) {
           Log.d(TAG, "AllReady read");
           return true;
       }

       return false;
   }

   /**
    *
    * @param context
    * @return
    */
   public boolean isRecentArticleExists(Context context) {
       Log.d(TAG, "start isRecentArticleExists");

       // Perosonium接続
       ODataCollection odata = initializePersonium(context);
       if (odata == null) {
           Log.w(TAG, "perosonium initialize error");
           return false;
       }

       // 今日の発行記事があるかチェック
       String recentArticle = readRecentArticle(odata);
       Log.d(TAG, "end isRecentArticleExists : " + recentArticle);

       if (recentArticle == null) {
           return false;
       }
       return true;
   }

   /**
    *
    * @param context
    * @return
    */
   public PublishStatus initPublishStatus(Context context) {
       Log.d(TAG, "start initPublishStatus");

       PublishStatus ret = new PublishStatus();

       Calendar now = Calendar.getInstance();
       // 土曜日または日曜日ならば新聞発行なし
       if (isSaturdayOrSunday(Calendar.getInstance())) {
           Log.d(TAG, "Today is SATURDAY or SUNDAY");
           return ret;
       }

       // Perosonium接続
       ODataCollection odata = initializePersonium(context);
       if (odata == null) {
           Log.w(TAG, "perosonium initialize error");
           return null;
       }

       // 休刊日情報のチェック
       boolean isHoliday = isNewspaperHoliday(odata, now);
       if (isHoliday) {
           // 休刊日
           return ret;
       }

       // 発行時刻の取得
       Calendar publishTime = getPublishTime(odata);
       if (publishTime == null) {
           return null;
       }

       ret.lastRequestDate = Calendar.getInstance();
       ret.publishTime = publishTime;
       ret.isPublishDay = true;
       Log.d(TAG, "end initPublishStatus");
       return ret;
   }

    private void fetchAccountManager(Context context) {
        manager = AccountManager.get(context);
        Account[] accountList = manager.getAccountsByType(ACCOUNT_TYPE);
        if (accountList.length == 0) {
            // Account is not exists.
            Log.e(TAG, "THIS DEVICE HAS NO ACCOUNT.");
            return;
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
        if (account == null) {
            Log.d(TAG, "personium failure : account not exists.");
            return null;
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

    /**
     * AccountManagerからPersonium接続情報を取得し、Perosoniumの認証を行う。
     * @param context コンテキスト
     * @return ODataコレクション
     */
    public InputStream getThumbnailFromWebDav(Context context, String imagePath, String thumbnailUrl) {
        Log.d(TAG, "start getFileFromWebDav");

        fetchAccountManager(context);
        if (account == null) {
            Log.d(TAG, "personium failure : account not exists.");
            return null;
        }

        String token = getAuthToken(context);
        String baseUrl = manager.getUserData(account, "baseUrl");
        String cellName = manager.getUserData(account, "cellName");
        String boxName = manager.getUserData(account, "boxName");
        userName = account.name;

        Log.d(TAG, "userName : " + userName);
        Log.d(TAG, "token : " + token);
        Log.d(TAG, "baseUrl : " + baseUrl);
        Log.d(TAG, "cellName : " + cellName);
        Log.d(TAG, "bxoName :" + boxName);

        dc = new DcContext(baseUrl, cellName, "", boxName);
        DcContext.setPlatform("android");
        InputStream inputStream = null;
        try {
            DavCollection dav = dc.withToken(token).cell().box().col("dav");
            String[] pathArray = imagePath.split("/");
            for (String path : pathArray) {
                dav = dav.col(path);
            }
            inputStream = dav.getStream(thumbnailUrl);
        } catch (DaoException e) {
            Log.d(TAG, "personium failure : " + e.getMessage());
            return null;
        }
        return inputStream;
    }
}

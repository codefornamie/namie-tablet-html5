/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import jp.fukushima.namie.town.news.WidgetContentManager.MessageStyle;
import jp.fukushima.namie.town.news.PublishStatus.ArticleExists;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.SystemClock;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;

/**
 * なみえ新聞ウィジェット
 */
public class NamieWidgetProvider extends AppWidgetProvider {
    private static final String TAG = "NamieNewspaper";
    private static final String WIDGET_UPDATE_ACTION = "jp.fukushima.namie.town.news.WIDGET_UPDATE_ACTION";

    // ウィジェット更新処理開始までのインターバル(ms)
    private static final int TIMER_START_DELAY = 3 * 1000;
    // ウィジェット更新インターバル(ms)
    private static final int UPDATE_INTERVAL = 500;
    // 既読チェックインターバル(ms)
    private static final int READ_CHECK_INTERVAL = 30 * 60 * 1000;

    // 未読状態の最終チェック時刻
    private static long lastUnreadCheckTime = 0;
    // ウィジェット表示情報管理オブジェクト
    private static WidgetContentManager contentManager = null;

    public NamieWidgetProvider() {
    }

    @Override
    public void onEnabled(Context context) {
        Log.d(TAG, "NamieWidgetProvider#onEnabled()");

        contentManager = new WidgetContentManager(context);
        lastUnreadCheckTime = 0;

        setUpdateAlarm(context);

        super.onEnabled(context);
    }

    @Override
    public void onDisabled(Context context) {
        Log.d(TAG, "NamieWidgetProvider#onDisalbed()");

        cancelUpdateAlarm(context);

        super.onDisabled(context);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(TAG, "NamieWidgetProvider#onUpdate()");
        super.onUpdate(context, appWidgetManager, appWidgetIds);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "NamieWidgetProvider#onReceive()");

        if (contentManager == null) {
            contentManager = new WidgetContentManager(context);
        }

        String action = intent.getAction();
        if (action.equals(Intent.ACTION_DATE_CHANGED) ||
            action.equals(Intent.ACTION_TIMEZONE_CHANGED) ||
            action.equals(Intent.ACTION_TIME_CHANGED) ||
            action.equals(Intent.ACTION_PACKAGE_REPLACED)) {
            cancelUpdateAlarm(context);
            setUpdateAlarm(context);
        } else if (action.equals(WIDGET_UPDATE_ACTION)) {
            // 新聞の発行、未読状態を更新
            updateNewspaperStatus(context);

            // ウィジェットの表示更新
            updateWidget(context);
        }

        super.onReceive(context, intent);
    }

    public WidgetContentManager getContentManager() {
        return contentManager;
    }

    private void updateNewspaperStatus(Context context) {
        PublishStatus publishStatus = PublishStatus.getInstance();

        // 日付が変更されていた場合、新聞発行情報を初期化
        if (!publishStatus.isDailyUpdated()) {
        	Log.d(TAG, "isDailyUpdated() is false");
            initPublishStatus(context);
        }

        // 新聞発行日でなければチェックしない
        if (!publishStatus.isPublishDay) {
            return;
        }

        // 新聞発行時刻を過ぎているかのチェック
        publishStatus.isPublished = publishStatus.isPastPublishTime();

        // 発行時刻を過ぎていない場合はこれ以上チェックしない
        if (!publishStatus.isPublished) {
            return;
        }

        long currentElaspedTime = SystemClock.elapsedRealtime();
        if (currentElaspedTime - lastUnreadCheckTime > READ_CHECK_INTERVAL) {
            lastUnreadCheckTime = currentElaspedTime;

            // 当日分記事の存在チェック（新聞発行後１回のみ）
            if (publishStatus.articleExists == ArticleExists.NOT_CHECKED) {
                checkRecentArticleExists(context);
            }

            // 新聞発行済、かつ未読であれば既読状態をチェック
            if (publishStatus.isPublished && !publishStatus.isReaded) {
                checkAlreadyReaded(context);
            }
        }
    }

    /**
     * 新聞の発行情報（発行時刻、休刊日）を取得する.
     * @param context コンテキスト
     */
    private void initPublishStatus(Context context) {
        PublishStatusInitializeThread requestThread = new PublishStatusInitializeThread(context, this);
        if (requestThread != null) {
            PublishStatus publishStatus = PublishStatus.getInstance();
            // 二重に更新スレッドが起動しないよう、リフレッシュ中のフラグを立てておく
            publishStatus.isRefreshing = true;
            requestThread.start();
        }
    }

    /**
     * 最新号の新聞の記事が存在するかどうかをチェックする.
     * @param context コンテキスト
     */
    private void checkRecentArticleExists(Context context) {
        RecentArticleCheckThread requestThread = new RecentArticleCheckThread(context, this);
        if (requestThread != null) {
            requestThread.start();
        }
    }

    /**
     * 最新号の新聞が参照済みかどうかをチェックする.
     * @param context コンテキスト
     */
    private void checkAlreadyReaded(Context context) {
        ArticleReadedCheckThread requestThread = new ArticleReadedCheckThread(context, this);
        if (requestThread != null) {
            requestThread.start();
        }
    }

    /**
     * ウィジェットの表示を更新する.
     * @param context コンテキスト
     */
    private void updateWidget(Context context) {
        AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
        ComponentName componentName = new ComponentName(context, NamieWidgetProvider.class);
        RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.widget_layout);

        // フレーム毎の表示情報を更新
        contentManager.nextFrame();

        // キャラの更新
        remoteViews.setImageViewResource(R.id.chara, contentManager.getImageId());

        // メッセージ更新
        setMessageViewStyle(context, remoteViews, contentManager.getMessageStyle());
        remoteViews.setTextViewText(R.id.fukidashi, Html.fromHtml(contentManager.getMessage()));
        remoteViews.setTextViewText(R.id.article_title, Html.fromHtml(contentManager.getMessage()));

        Resources resources = context.getResources();
        Configuration config = resources.getConfiguration();

        // ランドスケープの場合のみ表示する項目を更新
        if (config.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            remoteViews.setTextViewText(R.id.article_title_with_thumbnail, Html.fromHtml(contentManager.getMessage()));

            String siteName = contentManager.getSite();
            if (siteName != null) {
                remoteViews.setTextViewText(R.id.article_site, siteName);
                remoteViews.setTextViewText(R.id.article_site_with_thumbnail, siteName);
            }

            Bitmap thumbnail = contentManager.getThumbnail();
            if (thumbnail != null) {
                remoteViews.setImageViewBitmap(R.id.thumb, thumbnail);
            }
        }

        // 新聞発行の有無に応じて新聞アイコンを変更
        PublishStatus publishStatus = PublishStatus.getInstance();
        if (publishStatus != null) {
            boolean published = publishStatus.isPublished && !publishStatus.isReaded;
            setApplicationIcon(remoteViews, R.id.link_news, contentManager.getNewsIcon(published));
        }

        // PendingIntent設定
        setPendingIntents(context, remoteViews);

        widgetManager.updateAppWidget(componentName, remoteViews);
    }

    /**
     * メッセージの表示スタイルを変更する.
     * @param context コンテキスト
     * @param remoteViews 更新対象のRemoteViews
     * @param style メッセージの表示スタイル
     */
    private void setMessageViewStyle(Context context, RemoteViews remoteViews, MessageStyle style) {
        Resources resources = context.getResources();
        Configuration config = resources.getConfiguration();

        switch(config.orientation) {
        case Configuration.ORIENTATION_PORTRAIT:
            if (style == MessageStyle.STYLE_BUBBLE) {
                remoteViews.setViewVisibility(R.id.fukidashi, contentManager.getMessageVisiblity());
                remoteViews.setViewVisibility(R.id.recommend, View.INVISIBLE);
            } else {
                remoteViews.setViewVisibility(R.id.fukidashi, View.INVISIBLE);
                remoteViews.setViewVisibility(R.id.recommend, contentManager.getMessageVisiblity());
            }
            break;
        case Configuration.ORIENTATION_LANDSCAPE:
        default :
            if (style == MessageStyle.STYLE_BUBBLE) {
                remoteViews.setViewVisibility(R.id.fukidashi, contentManager.getMessageVisiblity());
                remoteViews.setViewVisibility(R.id.recommend, View.INVISIBLE);
                remoteViews.setViewVisibility(R.id.recommend_with_thumbnail, View.INVISIBLE);
            } else {
                remoteViews.setViewVisibility(R.id.fukidashi, View.INVISIBLE);
                if (contentManager.getThumbnail() != null) {
                    remoteViews.setViewVisibility(R.id.recommend, View.INVISIBLE);
                    remoteViews.setViewVisibility(R.id.recommend_with_thumbnail, contentManager.getMessageVisiblity());
                } else {
                    remoteViews.setViewVisibility(R.id.recommend, contentManager.getMessageVisiblity());
                    remoteViews.setViewVisibility(R.id.recommend_with_thumbnail, View.INVISIBLE);
                }
            }
            break;
        }
    }

    /**
     * buttonIdで指定したアプリアイコンをresourceIdの画像に変更する.
     * @param remoteViews 更新対象のRemoteViews
     * @param buttonId 変更するImageButtonのリソースID
     * @param resourceId アイコンのリソースID
     */
    private void setApplicationIcon(RemoteViews remoteViews, int buttonId, int resourceId) {
        remoteViews.setInt(buttonId, "setBackgroundResource", resourceId);
    }

    private void setUpdateAlarm(Context context) {
        // ウィジット更新用アラームの登録
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pendingIntent = getUpdateActionPendingIntent(context);
        long startDelay = System.currentTimeMillis() + TIMER_START_DELAY;
        alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, startDelay, UPDATE_INTERVAL , pendingIntent);
    }

    private void cancelUpdateAlarm(Context context) {
        // ウィジット更新用アラームの解除
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pendingIntent = getUpdateActionPendingIntent(context);
        alarmManager.cancel(pendingIntent);
    };

    /**
     * アプリ起動用のPendingIntentを設定する.
     * @param context コンテキスト
     * @param remoteViews 更新対象のRemoteViews
     */
    private void setPendingIntents(Context context, RemoteViews remoteViews) {
        remoteViews.setOnClickPendingIntent(R.id.link_news, getViewActionPendingIntent(context, "namie-news://"));
        remoteViews.setOnClickPendingIntent(R.id.link_post, getViewActionPendingIntent(context, "namie-letter://"));
        remoteViews.setOnClickPendingIntent(R.id.link_dojo, getViewActionPendingIntent(context, "namie-dojo://"));
    }

    /**
     * ウィジェット更新用のPendingIntentのインスタンスを返す.
     * @param context コンテキスト
     * @return PendingIntent
     */
    public PendingIntent getUpdateActionPendingIntent(Context context) {
        Intent intent = new Intent(context, NamieWidgetProvider.class);
        intent.setAction(WIDGET_UPDATE_ACTION);
        return PendingIntent.getBroadcast(context, 0, intent, 0);
    }

    /**
     * アプリケーション起動用のPendingIntentのインスタンスを返す.
     * @param context コンテキスト
     * @param url オープンするURL
     * @return PendingIntent
     */
    public PendingIntent getViewActionPendingIntent(Context context, String url) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(url));
        return PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
    }
}

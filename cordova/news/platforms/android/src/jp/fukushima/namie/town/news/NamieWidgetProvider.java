/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import jp.fukushima.namie.town.news.WidgetContentManager.MessageStyle;
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
    private static final String WIDGET_UPDATE_STATUS = "jp.fukushima.namie.town.news.WIDGET_UPDATE_STATUS";
    private static final String WIDGET_UPDATE_READED = "jp.fukushima.namie.town.news.WIDGET_UPDATE_READED";
    private static final String WIDGET_SET_READED = "jp.fukushima.namie.town.news.WIDGET_SET_READED";

    // ウィジェット更新処理開始までのインターバル(ms)
    private static final int TIMER_START_DELAY = 3 * 1000;
    // ウィジェット更新インターバル(ms)
    private static final int UPDATE_INTERVAL = 500;
    // 既読チェックインターバル(ms)
    private static final long READ_CHECK_INTERVAL = 1 * 60 * 1000;
    // おすすめ記事チェックインターバル(ms)
    private static final long RECOMMEND_UPDATE_INTERVAL = 2 * 60 * 1000;

    // ウィジェット表示情報管理オブジェクト
    private static WidgetContentManager contentManager = null;

    public NamieWidgetProvider() {
    }

    @Override
    public void onEnabled(Context context) {
        Log.d(TAG, "NamieWidgetProvider#onEnabled()");

        contentManager = new WidgetContentManager(context);

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
            // ウィジェットの表示更新
            updateWidget(context);
        } else if (action.equals(WIDGET_UPDATE_STATUS)) {
            // 新聞発行情報を取得
            initPublishStatus(context);
        } else if (action.equals(WIDGET_UPDATE_READED)) {
            // 新聞の発行、未読状態を更新
            checkAlreadyReaded(context);
        } else if (action.equals(WIDGET_SET_READED)) {
            // 既読に設定
            PublishStatus publishStatus = PublishStatus.getInstance();
            publishStatus.isReaded = true;
        }

        super.onReceive(context, intent);
    }

    public WidgetContentManager getContentManager() {
        return contentManager;
    }

    /**
     * 新聞の発行情報（発行時刻、休刊日）を取得する.
     * @param context コンテキスト
     */
    private void initPublishStatus(Context context) {
        PublishStatusInitializeThread requestThread = new PublishStatusInitializeThread(context, this);
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
            boolean published = publishStatus.isPastPublishTime() && !publishStatus.isReaded;
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

    /**
     * ウィジェット表示更新、サーバアクセス用アラームの登録
     * @param context
     */
    private void setUpdateAlarm(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        // ウィジット表示更新用アラームの登録
        long startDelay = System.currentTimeMillis() + TIMER_START_DELAY;
        alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, startDelay, UPDATE_INTERVAL , getUpdateActionPendingIntent(context));
        // おすすめ記事更新アラームの登録
        alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, 0, RECOMMEND_UPDATE_INTERVAL , getUpdateStatusPendingIntent(context));
        // 新着アラームの登録
        alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, 0, READ_CHECK_INTERVAL , getUpdateReadedPendingIntent(context));
    }

    /**
     * ウィジット表示更新、サーバアクセス用アラームの解除
     * @param context
     */
    private void cancelUpdateAlarm(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        alarmManager.cancel(getUpdateActionPendingIntent(context));
        alarmManager.cancel(getUpdateStatusPendingIntent(context));
        alarmManager.cancel(getUpdateReadedPendingIntent(context));
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
    private PendingIntent getUpdateActionPendingIntent(Context context) {
        Intent intent = new Intent(context, NamieWidgetProvider.class);
        intent.setAction(WIDGET_UPDATE_ACTION);
        return PendingIntent.getBroadcast(context, 0, intent, 0);
    }

    /**
     * おすすめ記事取得用のPendingIntentのインスタンスを返す.
     * @param context コンテキスト
     * @return PendingIntent
     */
    private PendingIntent getUpdateStatusPendingIntent(Context context) {
        Intent intent = new Intent(context, NamieWidgetProvider.class);
        intent.setAction(WIDGET_UPDATE_STATUS);
        return PendingIntent.getBroadcast(context, 0, intent, 0);
    }

    /**
     * 新着チェック用のPendingIntentのインスタンスを返す.
     * @param context コンテキスト
     * @return PendingIntent
     */
    private PendingIntent getUpdateReadedPendingIntent(Context context) {
        Intent intent = new Intent(context, NamieWidgetProvider.class);
        intent.setAction(WIDGET_UPDATE_READED);
        return PendingIntent.getBroadcast(context, 0, intent, 0);
    }

    /**
     * アプリケーション起動用のPendingIntentのインスタンスを返す.
     * @param context コンテキスト
     * @param url オープンするURL
     * @return PendingIntent
     */
    private PendingIntent getViewActionPendingIntent(Context context, String url) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(url));
        return PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
    }
}

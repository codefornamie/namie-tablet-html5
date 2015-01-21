/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.Calendar;

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

    // フレームインデックス
    private static int frameIndex = 0;
    // 表示メッセージを切り替えるまでのフレーム数
    private static final int MESSAGE_ACTION_FRAME = 16;
    // メッセージを非表示とするフレームインデックス
    private static final int SHOW_MESSAGE_FRAME = 14;

    private static PublishStatus publishStatus = null;
    // 未読状態の最終チェック時刻
    private static long lastUnreadCheckTime = 0;

    private static int imageIndex = 0;
    private static int[] images = { R.drawable.img_ukedon_1, R.drawable.img_ukedon_2};
    private static int messageIndex = 0;
    private static String[] messages = null;

    public NamieWidgetProvider() {
        if (publishStatus == null) {
            publishStatus = new PublishStatus();
        }
    }

    @Override
    public void onEnabled(Context context) {
        Log.d(TAG, "NamieWidgetProvider#onEnabled()");

        // ウィジット更新用アラームの登録
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pendingIntent = getUpdateActionPendingIntent(context);
        long startDelay = System.currentTimeMillis() + TIMER_START_DELAY;
        alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, startDelay, UPDATE_INTERVAL , pendingIntent);

        super.onEnabled(context);
    }

    @Override
    public void onDisabled(Context context) {
        Log.d(TAG, "NamieWidgetProvider#onDisalbed()");

        // ウィジット更新用アラームの解除
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pendingIntent = getUpdateActionPendingIntent(context);
        alarmManager.cancel(pendingIntent);

        super.onDisabled(context);
    };

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(TAG, "NamieWidgetProvider#onUpdate()");
        super.onUpdate(context, appWidgetManager, appWidgetIds);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "NamieWidgetProvider#onReceive()");

        String action = intent.getAction();
        if (action.equals(WIDGET_UPDATE_ACTION)) {
            if(messages == null){
                messages = context.getResources().getStringArray(R.array.messages);
            }

            // 新聞の発行、未読状態を更新
            updateNewspaperStatus(context);

            // ウィジェットの表示更新
            updateWidget(context);
        }
        super.onReceive(context, intent);
    }

    public PublishStatus getPublishStatus() {
        return publishStatus;
    }

    public void setPublishStatus(PublishStatus stat) {
        publishStatus = stat;
    }

    private void updateNewspaperStatus(Context context) {
        // 日付が変更されていた場合、新聞発行情報を初期化
        if (!publishStatus.isDailyUpdated()) {
            // 連続して呼び出されないように一旦最終処理日時をセットしておく
            publishStatus.lastRequestDate = Calendar.getInstance();
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

        // キャラの更新
        imageIndex = (imageIndex + 1) % images.length;
        remoteViews.setImageViewResource(R.id.chara, images[imageIndex]);

        // 新聞発行の有無に応じて新聞アイコンを変更
        if (publishStatus.isPublished && !publishStatus.isReaded) {
            setApplicationIcon(remoteViews, R.id.link_news, R.drawable.button_news_2);
        } else {
            setApplicationIcon(remoteViews, R.id.link_news, R.drawable.button_news);
        }

        // メッセージ更新
        if (frameIndex == 0) {
            messageIndex = (messageIndex + 1) % messages.length;
        }
        if ((frameIndex < SHOW_MESSAGE_FRAME)) {
            // ・文章更新
            remoteViews.setTextViewText(R.id.fukidashi, Html.fromHtml(messages[messageIndex]));
            remoteViews.setViewVisibility(R.id.fukidashi, View.VISIBLE);
        } else {
            // 一時非表示
            remoteViews.setViewVisibility(R.id.fukidashi, View.INVISIBLE);
        }
        frameIndex = (frameIndex + 1) % MESSAGE_ACTION_FRAME;

        // アイコンタップ時のPendingIntent設定
        setPendingIntents(context, remoteViews);

        widgetManager.updateAppWidget(componentName, remoteViews);
    }

    /**
     * メッセージの表示スタイルを変更する.
     * @param context コンテキスト
     * @param remoteViews 更新対象のRemoteViews
     * @param type 0:吹き出し 1:記事切り抜き
     */
    private void setMessageViewStyle(Context context, RemoteViews remoteViews, int type) {
        Resources resources = context.getResources();
        float density = resources.getDisplayMetrics().density;
        Configuration config = resources.getConfiguration();

        switch(config.orientation) {
        case Configuration.ORIENTATION_PORTRAIT:
            if (type == 0) {
                remoteViews.setInt(R.id.fukidashi, "setBackgroundResource", R.drawable.img_fukidashi_v);
                remoteViews.setViewPadding(R.id.fukidashi, dpToPx(density, 32), 0, dpToPx(density, 16), 0);
            } else {
                remoteViews.setInt(R.id.fukidashi, "setBackgroundResource", R.drawable.img_midashi);
                remoteViews.setViewPadding(R.id.fukidashi, dpToPx(density, 20), 0, dpToPx(density, 20), 0);
            }
            break;
        case Configuration.ORIENTATION_LANDSCAPE:
        default :
            if (type == 0) {
                remoteViews.setInt(R.id.fukidashi, "setBackgroundResource", R.drawable.img_fukidashi);
                remoteViews.setViewPadding(R.id.fukidashi, dpToPx(density, 60), 0, dpToPx(density, 30), 0);
            } else {
                remoteViews.setInt(R.id.fukidashi, "setBackgroundResource", R.drawable.img_midashi);
                remoteViews.setViewPadding(R.id.fukidashi, dpToPx(density, 20), 0, dpToPx(density, 20), 0);
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
     * dpの値からpxを求めて返す.
     * @param density density
     * @param dp dp
     * @return ピクセル値
     */
    private int dpToPx(float density, float dp) {
        return (int) (dp * density + 0.5f);
    }

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
     * ウィジェット更新要のPendingIntentのインスタンスを返す.
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

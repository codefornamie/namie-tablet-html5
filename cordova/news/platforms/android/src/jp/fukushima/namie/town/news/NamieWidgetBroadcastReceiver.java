package jp.fukushima.namie.town.news;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;

public class NamieWidgetBroadcastReceiver extends BroadcastReceiver {

    public static int frame = 0;
    public static final int PER_FRAME = 16;
    public static final int SHOW_MESSAGE_FRAME = 14;
    public static int[] images = { R.drawable.img_ukedon_1, R.drawable.img_ukedon_2};
    public static String[] messages = null;
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("kuro", "NamieWidgetBroadcastReceiver()");
        if(messages == null){
            messages = context.getResources().getStringArray(R.array.messages);
        }

        RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.widget_layout);
        ComponentName thiswidget = new ComponentName(context, NamieWidgetProvider.class);
        AppWidgetManager manager = AppWidgetManager.getInstance(context);

        // キャラの更新処理
        remoteViews.setImageViewResource(R.id.chara, images[frame % images.length]);
        // 吹き出し表示更新処理
        // ・文章更新
        // ・吹き出し一時非表示処理
        if ((frame % PER_FRAME < SHOW_MESSAGE_FRAME)) {
            remoteViews.setTextViewText(R.id.fukidashi, Html.fromHtml(messages[(frame / PER_FRAME) % messages.length]));
            remoteViews.setViewVisibility(R.id.fukidashi, View.VISIBLE);
        } else {
            remoteViews.setViewVisibility(R.id.fukidashi, View.INVISIBLE);
        }
        setPendingIntents(context, remoteViews);

        manager.updateAppWidget(thiswidget, remoteViews);
        frame++;
    }

    private void setPendingIntents(Context context, RemoteViews remoteViews) {

        String newsArticleUrl = "namie-news-article://";
        Intent newsArticleIntent = new Intent(Intent.ACTION_VIEW);
        newsArticleIntent.setData(Uri.parse(newsArticleUrl));
        //PendingIntent newsArticlePendingintent = PendingIntent.getActivity(context, 0, newsArticleIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        //	remoteViews.setOnClickPendingIntent(R.id.news_view_article, newsArticlePendingintent);

        String newsLeftUrl = "namie-news-left://";
        Intent newsLeftIntent = new Intent(Intent.ACTION_VIEW);
        newsLeftIntent.setData(Uri.parse(newsLeftUrl));
        PendingIntent newsLeftPendingintent = PendingIntent.getActivity(context, 0, newsLeftIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        remoteViews.setOnClickPendingIntent(R.id.left, newsLeftPendingintent);

        String newsUrl = "namie-news://";
        Intent newsIntent = new Intent(Intent.ACTION_VIEW);
        newsIntent.setData(Uri.parse(newsUrl));
        PendingIntent newsPendingintent = PendingIntent.getActivity(context, 0, newsIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        remoteViews.setOnClickPendingIntent(R.id.link1, newsPendingintent);

        String postingUrl = "namie-letter://";
        Intent postingIntent = new Intent(Intent.ACTION_VIEW);
        postingIntent.setData(Uri.parse(postingUrl));
        PendingIntent postingPendingintent = PendingIntent.getActivity(context, 0, postingIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        remoteViews.setOnClickPendingIntent(R.id.link2, postingPendingintent);

        String dojoUrl = "namie-dojo://";
        Intent dojoIntent = new Intent(Intent.ACTION_VIEW);
        dojoIntent.setData(Uri.parse(dojoUrl));
        PendingIntent dojoPendingintent = PendingIntent.getActivity(context, 0, dojoIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        remoteViews.setOnClickPendingIntent(R.id.link3, dojoPendingintent);
    }
}
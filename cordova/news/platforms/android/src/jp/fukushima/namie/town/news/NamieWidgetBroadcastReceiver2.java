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
import android.widget.RemoteViews;

public class NamieWidgetBroadcastReceiver2 extends BroadcastReceiver {

    public static int frame = 0;
    public static int[] images = { R.drawable.ukedon_2_1, R.drawable.ukedon_2_2};
    public static String[] messages = null;
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("kuro", "NamieWidgetBroadcastReceiver()");
        if(messages == null){
            messages = context.getResources().getStringArray(R.array.messages);
        }

        RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.widget_layout2);
        ComponentName thiswidget = new ComponentName(context, NamieWidgetProvider2.class);
        AppWidgetManager manager = AppWidgetManager.getInstance(context);

        // キャラの更新処理
        remoteViews.setImageViewResource(R.id.chara, images[frame % images.length]);
        remoteViews.setTextViewText(R.id.fukidashi, Html.fromHtml(messages[(frame / 10) % messages.length]));
        setPendingIntents(context, remoteViews);

        manager.updateAppWidget(thiswidget, remoteViews);
        frame++;
    }

    private void setPendingIntents(Context context, RemoteViews remoteViews) {
        String newsUrl = "namie-news://";
        Intent newsIntent = new Intent(Intent.ACTION_VIEW);
        newsIntent.setData(Uri.parse(newsUrl));
        PendingIntent newsPendingintent = PendingIntent.getActivity(context, 0, newsIntent, 0);
        remoteViews.setOnClickPendingIntent(R.id.link21, newsPendingintent);

        String postingUrl = "namie-posting://";
        Intent postingIntent = new Intent(Intent.ACTION_VIEW);
        postingIntent.setData(Uri.parse(postingUrl));
        PendingIntent postingPendingintent = PendingIntent.getActivity(context, 0, postingIntent, 0);
        remoteViews.setOnClickPendingIntent(R.id.link22, postingPendingintent);

        String dojoUrl = "namie-dojo://";
        Intent dojoIntent = new Intent(Intent.ACTION_VIEW);
        dojoIntent.setData(Uri.parse(dojoUrl));
        PendingIntent dojoPendingintent = PendingIntent.getActivity(context, 0, dojoIntent, 0);
        remoteViews.setOnClickPendingIntent(R.id.link23, dojoPendingintent);
    }
}
package jp.fukushima.namie.town;

import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViews;

public class NamieWidgetBroadcastReceiver extends BroadcastReceiver {

    public static int frame = 0;
    public static int[] images = { R.drawable.nami, R.drawable.namir };
    public static String[] messages = {"こんにちわ", "こんばんわ", "さよなら"};
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("kuro", "NamieWidgetBroadcastReceiver()");

        RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.widget_layout);
        ComponentName thiswidget = new ComponentName(context, NamieWidgetProvider.class);
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        
        // キャラの更新処理
        remoteViews.setImageViewResource(R.id.chara, images[frame % images.length]);
        remoteViews.setTextViewText(R.id.fukidashi, messages[(frame / 10) % messages.length]);
        
        manager.updateAppWidget(thiswidget, remoteViews);
        frame++;
    }
}
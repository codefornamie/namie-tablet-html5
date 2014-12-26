package jp.fukushima.namie.town.news;

import jp.fukushima.namie.town.news.NamieTabletNews;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.RemoteViews;


/**
 * The weather widget's AppWidgetProvider.
 */
public class NamieWidgetProvider2 extends AppWidgetProvider {
    public NamieWidgetProvider2() {
    }
    @Override
    public void onEnabled(Context context) {
        Log.d("namie", "WeatherWidgetProvider#onEnabled()");

        // ウィジット更新用アラームマネージャの登録
        AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, NamieWidgetBroadcastReceiver2.class);
        PendingIntent pi = PendingIntent.getBroadcast(context, 0, intent, 0);
        am.setRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis()+ 1000 * 3, 500 , pi);
        
        super.onEnabled(context);
    }
    

    public void onDisabled(Context context) {
        Log.d("namie", "onDisalbed()");
        // ウィジット更新用アラームマネージャの解除
        Intent intent = new Intent(context, NamieWidgetBroadcastReceiver2.class);
        PendingIntent sender = PendingIntent.getBroadcast(context, 0, intent, 0);
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        alarmManager.cancel(sender);
        super.onDisabled(context);        
    };

    private RemoteViews buildLayout(Context context, int appWidgetId) {
        RemoteViews remoteView = new RemoteViews(context.getPackageName(), R.layout.widget_layout2);
        return remoteView;
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d("namie", "onUpdate()");
        for (int i = 0; i < appWidgetIds.length; ++i) {
            RemoteViews layout = buildLayout(context, appWidgetIds[i]);
            appWidgetManager.updateAppWidget(appWidgetIds[i], layout);
        }
        super.onUpdate(context, appWidgetManager, appWidgetIds);
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context,
            AppWidgetManager appWidgetManager,
            int appWidgetId,
            Bundle newOptions) {
        Log.d("namie", "onAppWidgetOptionsChanged()");

        RemoteViews layout = buildLayout(context, appWidgetId);
        appWidgetManager.updateAppWidget(appWidgetId, layout);
    }
}
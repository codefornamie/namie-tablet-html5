package jp.fukushima.namie.town.news;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.net.Uri;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.TextView;

public class NamieWidgetBroadcastReceiver extends BroadcastReceiver {

    // 現在のフレーム数(約200msecで1増加する)
    public static int frame = 0;
    // 吹き出しメッセージが切り替わるまでのフレーム数
    public static final int PER_FRAME = 16;
    // 吹き出し表示後に吹き出しが非表示となるまでのフレーム数
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

    private void setTextViewStyle(Context context, RemoteViews remoteViews, int type) {
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

    private void setLinkIcon(RemoteViews remoteViews, int buttonId, int resourceId) {
        remoteViews.setInt(buttonId, "setBackgroundResource", resourceId);
    }

    private int dpToPx(float density, float dp) {
        return (int) (dp * density + 0.5f);
    }

    private void setPendingIntents(Context context, RemoteViews remoteViews) {
        String newsUrl = "namie-news://";
        Intent newsIntent = new Intent(Intent.ACTION_VIEW);
        newsIntent.setData(Uri.parse(newsUrl));
        PendingIntent newsPendingintent = PendingIntent.getActivity(context, 0, newsIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        remoteViews.setOnClickPendingIntent(R.id.link_news, newsPendingintent);

        String postingUrl = "namie-letter://";
        Intent postingIntent = new Intent(Intent.ACTION_VIEW);
        postingIntent.setData(Uri.parse(postingUrl));
        PendingIntent postingPendingintent = PendingIntent.getActivity(context, 0, postingIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        remoteViews.setOnClickPendingIntent(R.id.link_post, postingPendingintent);

        String dojoUrl = "namie-dojo://";
        Intent dojoIntent = new Intent(Intent.ACTION_VIEW);
        dojoIntent.setData(Uri.parse(dojoUrl));
        PendingIntent dojoPendingintent = PendingIntent.getActivity(context, 0, dojoIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        remoteViews.setOnClickPendingIntent(R.id.link_dojo, dojoPendingintent);
    }
}
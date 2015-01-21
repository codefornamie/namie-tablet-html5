/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.util.Log;

public class PublishStatusInitializeThread extends Thread {
    private static final String TAG = "NamieNewspaper";
    private final Context _mContext;
    private final NamieWidgetProvider _mWidgetProvider;
    private final WidgetContentManager _mWidgetContentManager;
    private final List<Integer> _mWidgets = new ArrayList<Integer>();

    public PublishStatusInitializeThread(Context context, NamieWidgetProvider widgetProvider, WidgetContentManager contentManager) {
        super();
        _mContext = context;
        _mWidgetProvider = widgetProvider;
        _mWidgetContentManager = contentManager;
    }

    public void add(int widget) {
        _mWidgets.add(widget);
    }

    @Override
    public void start() {
        super.start();
    }

    @Override
    public void run() {
        Log.d(TAG, "PublishStatusInitializeThread started.");

        PersoniumModel personium = new PersoniumModel();
        PublishStatus publishStatus = personium.initPublishStatus(_mContext);
        _mWidgetProvider.setPublishStatus(publishStatus);

        // おすすめ記事の取得
        List<String> recommendArticles = personium.readRecommendArticles(_mContext);
        if (recommendArticles != null) {
            for (String article : recommendArticles) {
                try {
                    JSONObject json = new JSONObject(article);
                    String title = json.getString("title");
                    if (title != null) {
                        _mWidgetContentManager.addRecommendArticle(title);
                    }
                } catch (JSONException e) {
                    Log.e(TAG, "PersoniumRequestThread error." + e.getMessage());
                }
            }
        }

        Log.d(TAG, "PublishStatusInitializeThread completed.");
    }
}

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

public class PersoniumRequestThread extends Thread {
    private static final String TAG = "kuro";
    private final Context _mContext;
    private final WidgetContentManager _mWidgetContentManager;
    private final ArrayList<Integer> _mWidgets = new ArrayList<Integer>();

    public PersoniumRequestThread(Context context, WidgetContentManager contentManager) {
        super();
        _mContext = context;
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
        Log.d(TAG, "PersoniumRequestThread started.");
        PersoniumModel personium = new PersoniumModel();

        String newArticle = personium.readRecentArticle(_mContext);
        _mWidgetContentManager.setPublished(newArticle != null);

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

        Log.d(TAG, "PersoniumRequestThread completed.");
    }
}

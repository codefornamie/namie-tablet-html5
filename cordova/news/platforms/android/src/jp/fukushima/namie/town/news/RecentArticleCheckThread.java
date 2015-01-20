/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import jp.fukushima.namie.town.news.PublishStatus.ArticleExists;
import android.content.Context;
import android.util.Log;

public class RecentArticleCheckThread extends Thread {
    private static final String TAG = "NamieNewspaper";
    private final Context _mContext;
    private final NamieWidgetProvider _mWidgetProvider;
    private final WidgetContentManager _mWidgetContentManager;
    private final ArrayList<Integer> _mWidgets = new ArrayList<Integer>();

    public RecentArticleCheckThread(Context context, NamieWidgetProvider widgetProvider, WidgetContentManager contentManager) {
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
        Log.d(TAG, "CheckPublishRequestThread started.");

        PersoniumModel personium = new PersoniumModel();

        boolean isArticleExists = personium.isRecentArticleExists(_mContext);
        PublishStatus status = _mWidgetProvider.getPublishStatus();
        if (isArticleExists) {
            status.articleExists = ArticleExists.EXISTS;
        } else {
            status.articleExists = ArticleExists.NOT_EXISTS;
        }

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

        Log.d(TAG, "CheckPublishRequestThread completed.");
    }
}

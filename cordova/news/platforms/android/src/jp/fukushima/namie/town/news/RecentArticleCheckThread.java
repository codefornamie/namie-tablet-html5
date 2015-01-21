/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.ArrayList;

import jp.fukushima.namie.town.news.PublishStatus.ArticleExists;
import android.content.Context;
import android.util.Log;

public class RecentArticleCheckThread extends Thread {
    private static final String TAG = "NamieNewspaper";
    private final Context _mContext;
    private final NamieWidgetProvider _mWidgetProvider;
    private final ArrayList<Integer> _mWidgets = new ArrayList<Integer>();

    public RecentArticleCheckThread(Context context, NamieWidgetProvider widgetProvider) {
        super();
        _mContext = context;
        _mWidgetProvider = widgetProvider;
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

        Log.d(TAG, "CheckPublishRequestThread completed.");
    }
}

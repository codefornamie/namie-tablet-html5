/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import android.content.Context;
import android.util.Log;

public class ArticleReadedCheckThread extends AbstractRequestThread {
    private static final String TAG = "NamieNewspaper";

    public ArticleReadedCheckThread(Context context, NamieWidgetProvider widgetProvider) {
        super(context, widgetProvider);
    }

    @Override
    public void run() {
        Log.d(TAG, "CheckPublishRequestThread started.");

        // 既読情報の取得
        PersoniumModel personium = new PersoniumModel();
        boolean isArticleReaded = personium.isArticleReaded(_mContext);
        PublishStatus status = _mWidgetProvider.getPublishStatus();
        status.isReaded = isArticleReaded;

        Log.d(TAG, "CheckPublishRequestThread completed.");
    }
}

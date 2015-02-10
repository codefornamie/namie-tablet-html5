/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import jp.fukushima.namie.town.news.PublishStatus.ArticleExists;
import android.content.Context;
import android.util.Log;

public class RecentArticleCheckThread extends AbstractRequestThread {
    private static final String TAG = "NamieNewspaper";

    public RecentArticleCheckThread(Context context, NamieWidgetProvider widgetProvider) {
        super(context, widgetProvider);
    }

    @Override
    public void run() {
        Log.i(TAG, "CheckPublishRequestThread started.");

        // 最新号の記事が存在するかどうかをチェックする
        PersoniumModel personium = new PersoniumModel();
        boolean isArticleExists = personium.isRecentArticleExists(_mContext);
        PublishStatus status = PublishStatus.getInstance();
        if (isArticleExists) {
            status.articleExists = ArticleExists.EXISTS;
        } else {
            status.articleExists = ArticleExists.NOT_EXISTS;
        }

        // おすすめ記事の取得
        WidgetContentManager contentManager = _mWidgetProvider.getContentManager();
        getRecommendArticles(contentManager);

        Log.i(TAG, "PersoniumRequestThread completed.");
    }
}

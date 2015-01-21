/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jp.fukushima.namie.town.news.PublishStatus.ArticleExists;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
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
        _mWidgetContentManager.clearRecommendArticle();
        List<Map<String, Object>> recommendArticles = personium.readRecommendArticles(_mContext);
        if (recommendArticles != null) {
            for (Map<String, Object> article : recommendArticles) {
                String title = (String) article.get("title");
                if (title != null) {
                    String imagePath = (String) article.get("imagePath");
                    String thumbnailUrl = (String) article.get("imageThumbUrl");
                    Bitmap thumbnail = getImage(imagePath, thumbnailUrl);
                    article.put("thumbnail", thumbnail);
                    _mWidgetContentManager.addRecommendArticle(article);
                }
            }
        }

        Log.d(TAG, "PersoniumRequestThread completed.");
    }

    private Bitmap getImage(String imagePath, String thumbnailUrl) {
        Bitmap bitmap = null;
        try {
            InputStream inputStream = null;
            if (thumbnailUrl.startsWith("http://") || thumbnailUrl.startsWith("https://")) {
                URL url = new URL(thumbnailUrl);
                inputStream = url.openStream();
            } else {
                PersoniumModel personium = new PersoniumModel();
                inputStream = personium.getThumbnailFromWebDav(_mContext, imagePath, thumbnailUrl);
            }

            // 元々サムネイルとして登録されている画像なのでリサイズせずにそのまま読み込む
            bitmap = BitmapFactory.decodeStream(inputStream);

            inputStream.close();
            return bitmap;
        } catch (Exception e) {
            return bitmap;
        }
    }
}

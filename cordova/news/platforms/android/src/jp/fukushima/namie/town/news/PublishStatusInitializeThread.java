/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
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

        Log.d(TAG, "PublishStatusInitializeThread completed.");
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

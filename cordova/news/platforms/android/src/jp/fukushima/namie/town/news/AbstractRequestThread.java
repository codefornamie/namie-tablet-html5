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

public abstract class AbstractRequestThread extends Thread {
    protected final Context _mContext;
    protected final NamieWidgetProvider _mWidgetProvider;
    protected final List<Integer> _mWidgets = new ArrayList<Integer>();

    public AbstractRequestThread(Context context, NamieWidgetProvider widgetProvider) {
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

    // おすすめ記事の取得
    protected void getRecommendArticles(WidgetContentManager contentManager) {
        PersoniumModel personium = new PersoniumModel();
        contentManager.clearRecommendArticle();
        List<Map<String, Object>> recommendArticles = personium.readRecommendArticles(_mContext);
        if (recommendArticles != null) {
            for (Map<String, Object> article : recommendArticles) {
                String title = (String) article.get("title");
                if (title != null) {
                    String imagePath = (String) article.get("imagePath");
                    String thumbnailUrl = (String) article.get("imageThumbUrl");
                    Bitmap thumbnail = getImage(imagePath, thumbnailUrl);
                    article.put("thumbnail", thumbnail);
                    contentManager.addRecommendArticle(article);
                }
            }
        }
    }

    private Bitmap getImage(String imagePath, String thumbnailUrl) {
        Bitmap bitmap = null;
        try {
            InputStream inputStream = null;
            if (thumbnailUrl.startsWith("http://") || thumbnailUrl.startsWith("https://")) {
                // HTTPでの画像取得
                URL url = new URL(thumbnailUrl);
                inputStream = url.openStream();
            } else {
                // WevDAV(personium.io)に格納されている画像の取得
                PersoniumModel personium = new PersoniumModel();
                inputStream = personium.getThumbnailFromWebDav(_mContext, imagePath, thumbnailUrl);
            }

            // 元々サムネイルとして登録されている画像なのでリサイズせずにそのまま読み込む
            bitmap = BitmapFactory.decodeStream(inputStream);

            if (inputStream != null) {
                inputStream.close();
            }
            return bitmap;
        } catch (Exception e) {
            return bitmap;
        }
    }
}

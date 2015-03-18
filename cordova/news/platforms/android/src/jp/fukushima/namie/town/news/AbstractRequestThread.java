/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

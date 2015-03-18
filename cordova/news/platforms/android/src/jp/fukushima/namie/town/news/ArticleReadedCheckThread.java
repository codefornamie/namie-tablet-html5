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
        PublishStatus status = PublishStatus.getInstance();
        status.isReaded = isArticleReaded;

        Log.d(TAG, "CheckPublishRequestThread completed.");
    }
}

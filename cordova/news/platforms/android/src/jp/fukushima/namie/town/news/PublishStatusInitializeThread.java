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

public class PublishStatusInitializeThread extends AbstractRequestThread {
    private static final String TAG = "NamieNewspaper";

    public PublishStatusInitializeThread(Context context, NamieWidgetProvider widgetProvider) {
        super(context, widgetProvider);
    }

    @Override
    public void run() {
        Log.i(TAG, "PublishStatusInitializeThread started.");
        
        PublishStatus publishStatus = PublishStatus.getInstance();
        
        try {
            // 配信時刻と休刊日情報を取得し、既読済み情報などを初期化する
            PersoniumModel personium = new PersoniumModel();
            // アカウントが設定されていない場合、情報取得は行わない
            if (personium.getAuthToken(_mContext) != null) {
                personium.initPublishStatus(_mContext, publishStatus);

                WidgetContentManager contentManager = _mWidgetProvider.getContentManager();
                if(contentManager != null){
                    // おすすめ記事の取得
                    getRecommendArticles(contentManager);

                    // 設定情報(COLOR_LABEL)の取得
                    String colorLabel = personium.getColorLabel(_mContext);
                    if(colorLabel != null){
                        contentManager.setSiteMap(colorLabel);
                    }
                }
            }
        } catch(Exception e){
            Log.e(TAG, "PublishStatusInitializeThread error", e);
        }

        Log.i(TAG, "PublishStatusInitializeThread completed.");
    }
}

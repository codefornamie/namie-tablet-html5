/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
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

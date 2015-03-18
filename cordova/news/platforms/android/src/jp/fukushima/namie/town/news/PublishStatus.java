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

import java.util.Calendar;

public class PublishStatus {
    /**
     * 発行時刻を経過した後、チェックするまでの遅延時間
     */
    public static final int CHECK_DELAY = 60 * 60 * 1000;
    /**
     * チェック時刻を分散させる範囲
     */
    public static final int CHECK_DISPERSION_RANGE = 60 * 60 * 1000;
    // インスタンス
    private static PublishStatus instance;

    // 最終サーバーリクエスト日時
    public volatile Calendar lastRequestDate;
    // 新聞発行時刻
    public volatile Calendar publishTime;
    // 発行日か否か
    public volatile boolean isPublishDay;

    // 最新号の新聞が参照済みかどうか
    public volatile boolean isReaded;
    // 次の更新時刻
    public long nextRefreshTimeInMillis = 0; 

    private PublishStatus() {
        lastRequestDate = null;
        publishTime = null;
        isPublishDay = false;
        isReaded = false;
    }

    /**
     * このクラスのシングルトンインスタンスを返す。
     * @return インスタンス
     */
    public static PublishStatus getInstance(){
    	if(instance == null){
    		instance = new PublishStatus();
    	}
    	return instance;
    }

    /**
     * 発行時刻を過ぎているかどうかを返す.
     * @return true:発行時刻を過ぎている
     */
    public boolean isPastPublishTime() {
        Calendar now = Calendar.getInstance();
        if (publishTime != null && now.compareTo(publishTime) >= 0) {
            return true;
        }
        return false;
    }
}

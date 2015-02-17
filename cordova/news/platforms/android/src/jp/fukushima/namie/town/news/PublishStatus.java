/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
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

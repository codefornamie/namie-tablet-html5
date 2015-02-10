/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.Calendar;
import java.util.Date;

import android.util.Log;

public class PublishStatus {
    private static final String TAG = "NamieNewspaper";
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
    // 最新号の記事状態
    public static enum ArticleExists {
        NOT_CHECKED,
        NOT_EXISTS,
        EXISTS
    };
    public volatile ArticleExists articleExists;

    // 当日の新聞が発行済かどうか
    public volatile boolean isPublished;
    // 最新号の新聞が参照済みかどうか
    public volatile boolean isReaded;
    // 現在、このインスタンスの更新処理中かどうか
    public volatile boolean isRefreshing;
    // 次の更新時刻
    public long nextRefreshTimeInMillis = 0; 

    private PublishStatus() {
        lastRequestDate = null;
        publishTime = null;
        isPublishDay = false;

        isPublished = false;
        articleExists = ArticleExists.NOT_CHECKED;
        isReaded = false;
        isRefreshing = false;
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
     * 日次の情報更新処理が必要かどうかを返す.
     * @return true:アップデート済み
     */
    public boolean isDailyUpdated() {
    	Log.d(TAG, "isDailyUpdated(): start: " + isRefreshing);
    	
    	// 現在他のスレッドで更新中の場合は、falseとする。
		if (isRefreshing) {
			return true;
		}
		// まだ一度も読み込めてない場合
		if(publishTime == null){
	    	Log.d(TAG, "isDailyUpdated(): publishTime is null");
			return false;
		}
		// 次回更新時刻を過ぎていない場合
        long now = System.currentTimeMillis();
    	Log.d(TAG, "now: " + new Date(now));
    	Log.d(TAG, "nextRefreshTimeInMillis: " + new Date(nextRefreshTimeInMillis));
        if(now < nextRefreshTimeInMillis){
        	return true;
        }
        // 次回更新時刻を設定
        nextRefreshTimeInMillis = publishTime.getTimeInMillis();
        while(nextRefreshTimeInMillis < now){
        	// 翌日になっていない場合は、１日加える。
        	nextRefreshTimeInMillis += 24 * 60 * 60 * 1000;
        }
        // 遅延時間と分散時間を加える
        nextRefreshTimeInMillis += CHECK_DELAY + Math.random() * CHECK_DISPERSION_RANGE;
        
        return false;
    }

    /**
     * 発行時刻を過ぎているかどうかを返す.
     * @return true:発行時刻を過ぎている
     */
    public boolean isPastPublishTime() {
        Calendar now = Calendar.getInstance();
        if (now.compareTo(publishTime) >= 0) {
            return true;
        }
        return false;
    }
}

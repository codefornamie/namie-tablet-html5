/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.Calendar;

public class PublishStatus {
    // 最終サーバーリクエスト日時
    public Calendar lastRequestDate;
    // 新聞発行時刻
    public Calendar publishTime;
    // 発行日か否か
    public boolean isPublishDay;
    // 最新号の記事状態
    public enum ArticleExists {
        NOT_CHECKED,
        NOT_EXISTS,
        EXISTS
    };
    public ArticleExists articleExists;

    // 当日の新聞が発行済かどうか
    public boolean isPublished;
    // 最新号の新聞が参照済みかどうか
    public boolean isReaded;

    public PublishStatus() {
        lastRequestDate = null;
        publishTime = null;
        isPublishDay = false;

        isPublished = false;
        articleExists = ArticleExists.NOT_CHECKED;
        isReaded = false;
    }

    /**
     * 日次の情報更新処理が必要かどうかを返す.
     * @return true:要アップデート
     */
    public boolean isDailyUpdated() {
        boolean ret = false;
        Calendar today = Calendar.getInstance();
        int day = today.get(Calendar.DAY_OF_MONTH);
        int lastDay = -1;
        if (lastRequestDate != null) {
            lastDay = lastRequestDate.get(Calendar.DAY_OF_MONTH);
        }
        if (lastDay == day) {
            ret = true;
        }
        return ret;
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

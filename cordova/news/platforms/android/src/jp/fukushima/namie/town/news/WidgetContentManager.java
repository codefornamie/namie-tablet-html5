/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.ArrayList;
import java.util.List;

import android.content.Context;
import android.view.View;

public class WidgetContentManager {
    private static final String RECOMMEND_ARTICLE_BEFORE = "<font color=\"red\">新しいニュース</font>があるよ！";
    private static final String RECOMMEND_ARTICLE_AFTER = "詳しくは新聞のアイコンをタップしてね";

    // フレームインデックス
    private int frameIndex = 0;
    // 表示メッセージを切り替えるまでのフレーム数
    private static final int MESSAGE_ACTION_FRAME = 16;
    // メッセージを非表示とするフレームインデックス
    private static final int SHOW_MESSAGE_FRAME = 14;

    // メッセージをスキップするかどうか
    private static boolean messageSkip = false;

    // メッセージの表示モード
    private static enum DisplayMode {
        DISPLAY_FIXED_MESSAGE,
        DISPLAY_RECOMMEND_BEFORE,
        DISPLAY_RECOMMEND,
        DISPLAY_RECOMMEND_AFTER
    };

    // メッセージの表示スタイル
    public static enum MessageStyle {
        STYLE_BUBBLE,
        STYLE_ARTICLE
    };

    private int imageIndex = 0;
    private int[] images = { R.drawable.img_ukedon_1, R.drawable.img_ukedon_2};
    private int messageIndex = 0;
    private List<String> messages = null;
    private int recommendArticleIndex = 0;
    private List<String> recommendArticles = null;

    private DisplayMode displayMode = DisplayMode.DISPLAY_FIXED_MESSAGE;;
    private MessageStyle messageStyle = MessageStyle.STYLE_BUBBLE;;
    private String message = null;
    private int messageVisiblity = View.VISIBLE;

    public WidgetContentManager(Context context) {
        if (recommendArticles == null) {
            recommendArticles = new ArrayList<String>();
        }
        if(messages == null){
            String[] messageArray = context.getResources().getStringArray(R.array.messages);
            messages = new ArrayList<String>();
            for (String msg : messageArray) {
                addMessage(msg);
            }
        }
    }

    /**
     * フレーム更新に伴う表示情報を設定する.
     */
    public void nextFrame() {
        imageIndex = (imageIndex + 1) % images.length;

        if (frameIndex == 0) {
            // メッセージ表示モードの決定
            if (displayMode == DisplayMode.DISPLAY_FIXED_MESSAGE) {
                // [たまに」記事切り抜きを表示
                if (messageIndex == (messages.size() - 1) && !messageSkip && !recommendArticles.isEmpty()) {
                    displayMode = DisplayMode.DISPLAY_RECOMMEND_BEFORE;
                }
            } else if (displayMode == DisplayMode.DISPLAY_RECOMMEND_BEFORE) {
                displayMode = DisplayMode.DISPLAY_RECOMMEND;
            } else if (displayMode == DisplayMode.DISPLAY_RECOMMEND) {
                displayMode = DisplayMode.DISPLAY_RECOMMEND_AFTER;
            } else if (displayMode == DisplayMode.DISPLAY_RECOMMEND_AFTER) {
                displayMode = DisplayMode.DISPLAY_FIXED_MESSAGE;
            }

            // 表示メッセージのインデックスをインクリメント
            if (displayMode == DisplayMode.DISPLAY_FIXED_MESSAGE) {
                messageIndex = (messageIndex + 1) % messages.size();
            } else if (displayMode == DisplayMode.DISPLAY_RECOMMEND) {
                recommendArticleIndex = (recommendArticleIndex + 1) % recommendArticles.size();
            }

            // 表示メッセージのスタイルとテキストを決める
            if (displayMode == DisplayMode.DISPLAY_RECOMMEND_BEFORE) {
                messageStyle = MessageStyle.STYLE_BUBBLE;
                message = RECOMMEND_ARTICLE_BEFORE;
            } else if (displayMode == DisplayMode.DISPLAY_RECOMMEND) {
                messageStyle = MessageStyle.STYLE_ARTICLE;
                message = recommendArticles.get(recommendArticleIndex);
            } else if (displayMode == DisplayMode.DISPLAY_RECOMMEND_AFTER) {
                messageStyle = MessageStyle.STYLE_BUBBLE;
                message = RECOMMEND_ARTICLE_AFTER;
            } else {
                messageStyle = MessageStyle.STYLE_BUBBLE;
                message = messages.get(messageIndex);
            }
        }

        // 吹き出しの表示／非表示
        if ((frameIndex < SHOW_MESSAGE_FRAME)) {
            messageVisiblity = View.VISIBLE;
        } else {
            messageVisiblity = View.INVISIBLE;
        }

        messageSkip = false;
        frameIndex = (frameIndex + 1) % MESSAGE_ACTION_FRAME;
    }

    /**
     * ウィジェットに表示するメッセージを追加する.
     * @param message メッセージテキスト
     */
    public void addMessage(String message) {
        messages.add(message);
    }

    /**
     * ウィジェットに表示するおすすめ記事を追加する.
     * @param message メッセージテキスト
     */
    public void addRecommendArticle(String message) {
        recommendArticles.add(message);
    }

    /**
     * 表示中のメッセージをスキップする.
     */
    public void skipMessage() {
        messageSkip = true;
        displayMode = DisplayMode.DISPLAY_FIXED_MESSAGE;
        frameIndex = 0;
    }

    /**
     * キャラクタ画像のリソースIDを返す.
     * @return リソースID
     */
    public int getImageId() {
        return images[imageIndex];
    }

    /**
     * 新聞アイコンのリソースIDを返す.
     * @param published true:新着あり false:新着なし
     * @return リソースID
     */
    public int getNewsIcon(boolean published) {
        int id = R.drawable.button_news;
        if (published) {
            id = R.drawable.button_news_2;
        }
        return id;
    }

    /**
     * 吹き出しの表示状態を返す.
     * @return 表示状態（View.VISIVLE:表示 View.INVISIBLE:非表示）
     */
    public int getMessageVisiblity() {
        return messageVisiblity;
    }

    /**
     * メッセージの表示スタイルを返す.
     * @return 表示スタイル
     */
    public MessageStyle getMessageStyle() {
        return messageStyle;
    }

    /**
     * メッセージテキストを返す.
     * @return メッセージテキスト
     */
    public String getMessage() {
        return message;
    }
}
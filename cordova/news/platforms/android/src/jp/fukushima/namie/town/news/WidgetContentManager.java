/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import android.content.Context;
import android.graphics.Bitmap;
import android.util.Log;
import android.view.View;

public class WidgetContentManager {
    private static final String TAG = "NamieNewspaper";
    private static final String RECOMMEND_ARTICLE_BEFORE = "<font color=\"red\">新しいニュース</font>があるよ！";
    private static final String RECOMMEND_ARTICLE_AFTER = "詳しくは新聞のアイコンをタップしてね";

    // フレームインデックス
    private int frameIndex = 0;
    // 表示メッセージを切り替えるまでのフレーム数
    private static final int MESSAGE_ACTION_FRAME = 16;
    // メッセージを非表示とするフレームインデックス
    private static final int SHOW_MESSAGE_FRAME = 14;

    // メッセージをスキップするかどうか
    private boolean messageSkip = false;

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
    private List<Map<String, Object>> recommendArticles = null;
    private Map<String, String> siteNameMap = null;

    private DisplayMode displayMode = DisplayMode.DISPLAY_FIXED_MESSAGE;;
    private MessageStyle messageStyle = MessageStyle.STYLE_BUBBLE;;
    private String site = null;
    private String message = null;
    private Bitmap thumbnail = null;
    private int messageVisiblity = View.VISIBLE;

    public WidgetContentManager(Context context) {
        if (recommendArticles == null) {
            recommendArticles = new ArrayList<Map<String, Object>>();
        }
        CloudContents.setContext(context);
        messages = CloudContents.getInstance().getCharaMessages();
    }

    /**
     * フレーム毎に表示情報を更新する.
     */
    public void nextFrame() {
        imageIndex = (imageIndex + 1) % images.length;

        if (frameIndex == 0) {
            messages = CloudContents.getInstance().getCharaMessages();
            synchronized(recommendArticles){
                // メッセージ表示モードの遷移
                displayMode = nextDisplayMode(displayMode);
                // 表示メッセージのインデックスをインクリメント
                if (displayMode == DisplayMode.DISPLAY_FIXED_MESSAGE) {
                    messageIndex = (messageIndex + 1) % messages.size();
                } else if (displayMode == DisplayMode.DISPLAY_RECOMMEND) {
                    recommendArticleIndex = (recommendArticleIndex + 1) % recommendArticles.size();
                }

                // 表示メッセージのスタイルとテキストを決める
                messageStyle =  getMessageStyle(displayMode);
                site = getSiteFromArticle(displayMode);
                message = getTitleFromArticle(displayMode);
                thumbnail = getThumbnailFromArticle(displayMode);

                // メッセージの取得に失敗した場合は固定メッセージ表示とする
                if (message == null) {
                    Log.e(TAG, "Widget message is null.");
                    displayMode = DisplayMode.DISPLAY_FIXED_MESSAGE;
                    messageStyle = MessageStyle.STYLE_BUBBLE;
                    message = messages.get(messageIndex);
                }
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
     * メッセージ表示モードを遷移する.
     * @param currentMode 現在のメッセージ表示モード
     * @return メッセージ表示モード
     */
    private DisplayMode nextDisplayMode(DisplayMode currentMode) {
        DisplayMode nextMode = currentMode;
        if (messageSkip) {
            return nextMode;
        }
        if (currentMode == DisplayMode.DISPLAY_FIXED_MESSAGE) {
            // 固定メッセージのループごとに記事切り抜きを表示
            if (messageIndex == (messages.size() - 1) && !recommendArticles.isEmpty()) {
                nextMode = DisplayMode.DISPLAY_RECOMMEND_BEFORE;
            }
        } else if (currentMode == DisplayMode.DISPLAY_RECOMMEND_BEFORE) {
            nextMode = DisplayMode.DISPLAY_RECOMMEND;
        } else if (currentMode == DisplayMode.DISPLAY_RECOMMEND) {
            nextMode = DisplayMode.DISPLAY_RECOMMEND_AFTER;
        } else if (currentMode == DisplayMode.DISPLAY_RECOMMEND_AFTER) {
            nextMode = DisplayMode.DISPLAY_FIXED_MESSAGE;
        }
        return nextMode;
    }

    /**
     * 表示モードに応じたメッセージのスタイルを返す.
     * @param currentMode
     * @return
     */
    private MessageStyle getMessageStyle(DisplayMode currentMode) {
        MessageStyle style = MessageStyle.STYLE_BUBBLE;
        if (currentMode == DisplayMode.DISPLAY_RECOMMEND_BEFORE) {
            style = MessageStyle.STYLE_BUBBLE;
        } else if (currentMode == DisplayMode.DISPLAY_RECOMMEND) {
            style = MessageStyle.STYLE_ARTICLE;
        } else if (currentMode == DisplayMode.DISPLAY_RECOMMEND_AFTER) {
            style = MessageStyle.STYLE_BUBBLE;
        } else {
            style = MessageStyle.STYLE_BUBBLE;
        }
        return style;
    }

    private String getSiteFromArticle(DisplayMode currentMode) {
        String site = null;
        if (currentMode == DisplayMode.DISPLAY_RECOMMEND) {
            Map<String, Object> article = recommendArticles.get(recommendArticleIndex);
            site = (String) article.get("site");
        }
        return site;
    }

    private String getTitleFromArticle(DisplayMode currentMode) {
        String messageText = null;

        if (currentMode == DisplayMode.DISPLAY_RECOMMEND_BEFORE) {
            messageText = RECOMMEND_ARTICLE_BEFORE;
        } else if (currentMode == DisplayMode.DISPLAY_RECOMMEND) {
            Map<String, Object> article = recommendArticles.get(recommendArticleIndex);
            messageText = (String) article.get("title");
        } else if (currentMode == DisplayMode.DISPLAY_RECOMMEND_AFTER) {
            messageText = RECOMMEND_ARTICLE_AFTER;
        } else {
            messageText = messages.get(messageIndex);
        }
        return messageText;
    }

    private Bitmap getThumbnailFromArticle(DisplayMode currentMode) {
        Bitmap bitmap = null;
        if (currentMode == DisplayMode.DISPLAY_RECOMMEND) {
            Map<String, Object> article = recommendArticles.get(recommendArticleIndex);
            bitmap = (Bitmap) article.get("thumbnail");
        }
        return bitmap;
    }

    /**
     * ウィジェットに表示するメッセージを追加する.
     * @param message メッセージテキスト
     */
    public void addMessage(String message) {
        messages.add(message);
    }

    /**
     * おすすめ記事をクリアする.
     */
    public void clearRecommendArticle() {
        synchronized(recommendArticles){
            recommendArticles.clear();
        }
    }

    /**
     * おすすめ記事を追加する.
     * @param article 追加する記事情報
     */
    public void addRecommendArticle(Map<String, Object> article) {
        recommendArticles.add(article);
    }

    public void setSiteMap(String colorLabel) {
        siteNameMap = new HashMap<String, String>();
        JSONParser parser = new JSONParser();
        try {
            Object parsed = parser.parse(colorLabel);
            JSONArray array = (JSONArray) parsed;
            for (int i = 0; i < array.size(); i++) {
                JSONObject obj = (JSONObject)array.get(i);
                String site = (String) obj.get("site");
                String label = (String) obj.get("label");
                siteNameMap.put(site, label);
            }
        } catch (ParseException e) {
            Log.e(TAG, "COLOR_LABEL Json parse failed.");
            Log.e(TAG, colorLabel);
        }
        return;
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
            id = R.drawable.button_news_new;
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
     * おすすめ記事のソースサイト名を返す.
     * @return サイト名
     */
    public String getSite() {
        String siteName = site;
        if (siteNameMap != null && siteNameMap.containsKey(site)) {
            siteName = siteNameMap.get(site);
        }
        return siteName;
    }

    /**
     * メッセージテキストを返す.
     * @return メッセージテキスト
     */
    public String getMessage() {
        return message;
    }

    /**
     * サムネイル画像を返す.
     * @return サムネイル画像。サムネイルが存在しない場合はnull
     */
    public Bitmap getThumbnail() {
        return thumbnail;
    }
}

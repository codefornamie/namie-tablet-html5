package jp.fukushima.namie.town.news;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import android.content.Context;
import android.content.res.Resources;
import android.util.Log;

/**
 * キャラクターメッセージ
 */
public class CloudContents implements Runnable {
    private static final String TAG = "NamieNewspaper";
    /**
     * このクラスの唯一のインスタンス
     */
    private static CloudContents instance = null;

    /**
     * ウィジェットのコンテキスト
     */
    private Context context = null;

    /**
     * キャラメッセージ（通常）
     */
    private List<String> charaMessages = null;

    /**
     * キャラメッセージ（おすすめ前後）
     */
    @SuppressWarnings("unused")
    private List<String> charaMessagesOnRecommend = null;

    /**
     * データ更新中か否か
     */
    private volatile boolean isRefreshing = false;

    /**
     * キャラクターの画像パターン
     */
    private int[] charaPattern = null;

    /**
     * コンストラクタ 外部からは、getInstance()を使用する。
     */
    private CloudContents() {
        charaMessages = new ArrayList<String>();
        charaMessages.add("こんにちわ");
        charaMessages.add("うけどんです");
    }

    /**
     * ウィジェットのコンテキストを設定する。
     * 
     * @param context
     *            コンテキスト
     */
    public static void setContext(Context context) {
        if (context == null) {
            throw new IllegalArgumentException("context must not be null.");
        }
        if (instance == null) {
            instance = new CloudContents();
        }
        instance.context = context;
    }

    /**
     * このクラスのインスタンスを取得する。 このメソッドを呼び出す前にsetContext()を呼び出すこと。
     * 
     * @return インスタンス
     */
    public static CloudContents getInstance() {
        if (instance == null) {
            throw new IllegalStateException(
                    "needs to be called before setContext().");
        }
        return instance;
    }

    /**
     * データの更新を要求する。 更新は非同期で行われる。
     */
    public void requestRefresh() {
        if (!isRefreshing) {
            new Thread(this).start();
        }
    }

    /**
     * データ更新
     */
    @Override
    public void run() {
        try {
            Log.i(TAG, "CloudContents thread start.");
            updateMessage();
            updateCharaPattern();
        } finally {
            isRefreshing = false;
            Log.i(TAG, "CloudContents thread end.");
        }
    }

    /**
     * メッセージの更新
     */
    @SuppressWarnings("unchecked")
    private void updateMessage() {
        PersoniumModel model = new PersoniumModel();
        List<String>[] lists = new List[2];
        for (int i = 0; i < lists.length; i++) {
            lists[i] = new ArrayList<String>();
        }
        List<Object> res = model.getCharaMessage(context);
        if (res != null) {
            for (Object rec : res) {
                Map<String, Object> r = (Map<String, Object>) rec;
                try {
                    int type = ((Long) r.get("type")).intValue();
                    lists[type - 1].add((String) r.get("message"));
                } catch (RuntimeException e) {
                    Log.w(TAG, "character_message parse error.");
                }
            }
        }
        if (lists[0].size() > 0) {
            charaMessages = lists[0];
        }
        if (lists[1].size() > 0) {
            charaMessagesOnRecommend = lists[1];
        }
    }

    private void updateCharaPattern() {
        PersoniumModel model = new PersoniumModel();
        String pat = model.getCharaPattern(context);
        if (pat != null) {
            Resources res = context.getResources();
            String pname = context.getPackageName();
            List<Integer> rlist = new ArrayList<Integer>();
            for (int i = 1; i < 10; i++) {
                int rid = res.getIdentifier(pat + "_" + i, "drawable", pname);
                if (rid == 0) {
                    break;
                }
                rlist.add(rid);
            }
            int[] arrRes = new int[rlist.size()];
            for (int i = 0; i < rlist.size(); i++) {
                arrRes[i] = rlist.get(i);
            }
            charaPattern = arrRes;
        }
    }

    /**
     * 通常時メッセージを取得する。
     * 
     * @return メッセージ
     */
    public List<String> getCharaMessages() {
        return new ArrayList<String>(charaMessages);
    }

    /**
     * ウィジェットに表示するキャラの表示パターンを返す。
     * 
     * @return キャラの表示パターンの画像リソースIDの配列。
     */
    public int[] getCharaPatterns() {
        if (charaPattern == null || charaPattern.length == 0) {
            return new int[] { R.drawable.img_ukedon_1, R.drawable.img_ukedon_2 };
        }
        return charaPattern;
    }
}

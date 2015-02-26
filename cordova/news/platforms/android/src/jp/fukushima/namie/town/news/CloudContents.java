package jp.fukushima.namie.town.news;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import android.content.Context;
import android.util.Log;

/**
 * キャラクターメッセージ
 */
public class CloudContents extends Thread {
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
            this.start();
        }
    }

    /**
     * データ更新スレッドを起動する。
     */
    @Override
    public synchronized void start() {
        isRefreshing = true;
        super.start();
    }

    /**
     * データ更新スレッド
     */
    @SuppressWarnings("unchecked")
    @Override
    public void run() {
        try {
            List<String>[] lists = new List[2];
            for (int i = 0; i < lists.length; i++) {
                lists[i] = new ArrayList<String>();
            }
            PersoniumModel model = new PersoniumModel();
            List<Object> res = model.getCharaMessage(context);
            for (Object rec : res) {
                Map<String, Object> r = (Map<String, Object>) rec;
                try{
                    if((Boolean)r.get("enabled")){
                        int type = ((Long) r.get("type")).intValue();
                        lists[type - 1].add((String) r.get("message"));
                    }
                }catch(RuntimeException e){
                    Log.w(TAG, "character_message parse error.");
                }
            }
            charaMessages = lists[0];
            charaMessagesOnRecommend = lists[1];
        } finally {
            isRefreshing = false;
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
}

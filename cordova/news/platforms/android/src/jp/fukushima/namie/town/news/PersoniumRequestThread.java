/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.ArrayList;
import android.content.Context;
import android.util.Log;

public class PersoniumRequestThread extends Thread {
    private static final String TAG = "kuro";
    private final Context _mContext;
    private final NamieWidgetProvider _mWidgetProvider;
    private final ArrayList<Integer> _mWidgets = new ArrayList<Integer>();

    public PersoniumRequestThread(Context context, NamieWidgetProvider widgetProvider) {
        super();
        _mContext = context;
        _mWidgetProvider = widgetProvider;
    }

    public void add(int widget) {
        _mWidgets.add(widget);
    }

    @Override
    public void start() {
        super.start();
    }

    @Override
    public void run() {
        Log.d(TAG, "PersoniumRequestThread started.");
        PersoniumModel personium = new PersoniumModel();
        String message = personium.readRecentArticle(_mContext);

        _mWidgetProvider.setPublished(message != null);

        Log.d(TAG, "PersoniumRequestThread completed.");
    }
}

/**
 * Copyright (C) 2014 Namie Town. All Rights Reserved.
 */
package jp.fukushima.namie.town.news;

import java.util.ArrayList;
import java.util.List;

import android.content.Context;
import android.util.Log;

public class PublishStatusInitializeThread extends Thread {
    private static final String TAG = "NamieNewspaper";
    private final Context _mContext;
    private final NamieWidgetProvider _mWidgetProvider;
    private final List<Integer> _mWidgets = new ArrayList<Integer>();

    public PublishStatusInitializeThread(Context context, NamieWidgetProvider widgetProvider) {
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
        Log.d(TAG, "PublishStatusInitializeThread started.");

        PersoniumModel personium = new PersoniumModel();
        PublishStatus publishStatus = personium.initPublishStatus(_mContext);
        _mWidgetProvider.setPublishStatus(publishStatus);

        Log.d(TAG, "PublishStatusInitializeThread completed.");
    }
}

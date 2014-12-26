package jp.fukushima.namie.town.MediaScanPlugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.util.Log;

public class MediaScanPlugin extends CordovaPlugin {
    public static final String ACTION = "scanFile";
    private static final String TAG = "MediaScanPlugin";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals(ACTION)) {
            String path = args.getString(0);
            // cordova.getActivity().sendBroadcast(new Intent(Intent.ACTION_MEDIA_MOUNTED, Uri.parse("file:///mnt/sdcard")));

            MediaScannerConnection.scanFile(
                cordova.getActivity(),
                new String[]{ path },
                null,
                new MediaScannerConnection.OnScanCompletedListener() {
                    @Override
                    public void onScanCompleted(final String path, final Uri uri) {
                        Log.i(TAG, String.format("Scanned path %s -> URI = %s", path, uri.toString()));
                    }
            });

            callbackContext.success();
            return true;
        } else {
            Log.w(TAG, "Wrong action was provided: "+action);
            return false;
        }
    }
}

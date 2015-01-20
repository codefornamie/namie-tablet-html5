package jp.fukushima.namie.town.PcsAccountManagerPlugin;

import java.util.Calendar;

import android.accounts.AbstractAccountAuthenticator;
import android.accounts.Account;
import android.accounts.AccountAuthenticatorResponse;
import android.accounts.AccountManager;
import android.accounts.NetworkErrorException;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.fujitsu.dc.client.Accessor;
import com.fujitsu.dc.client.Cell;
import com.fujitsu.dc.client.DaoException;
import com.fujitsu.dc.client.DcContext;

public class Authenticator extends AbstractAccountAuthenticator {
    private final Context ctx;

    public Authenticator(Context context) {
        super(context);
        ctx = context;
    }

    @Override
    public Bundle addAccount(AccountAuthenticatorResponse response, String accountType, String authTokenType,
                    String[] requiredFeatures, Bundle options) {
//        throw new UnsupportedOperationException();
        // アカウントの追加を行う画面を呼び出すIntentを生成
        final Intent intent = new Intent(ctx, LoginActivity.class);
        // アカウント追加後、戻り先の画面を設定
        intent.putExtra(AccountManager.KEY_ACCOUNT_AUTHENTICATOR_RESPONSE, response);

        // Intentを返却
        final Bundle bundle = new Bundle();
        bundle.putParcelable(AccountManager.KEY_INTENT, intent);
        return bundle;
    }

    @Override
    public Bundle confirmCredentials(AccountAuthenticatorResponse response, Account account, Bundle options) {
        return null;
    }

    @Override
    public Bundle editProperties(AccountAuthenticatorResponse response, String accountType) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Bundle getAuthToken(AccountAuthenticatorResponse response, Account account, String authTokenType,
                    Bundle loginOptions) throws NetworkErrorException {
        // If the caller requested an authToken type we don't support, then return an error
        // if (!authTokenType.equals("odata"))
        // {
        // final Bundle result = new Bundle();
        // result.putString(AccountManager.KEY_ERROR_MESSAGE, "invalid authTokenType");
        // return result;
        // }

        // Extract the username and password from the Account Manager, and ask
        // the server for an appropriate AuthToken.
        final AccountManager am = AccountManager.get(ctx);
        final String password = am.getPassword(account);
        if (password != null) {
            String baseUrl = am.getUserData(account, "baseUrl");
            String cellName = am.getUserData(account, "cellName");
            String schema = am.getUserData(account, "schema");
            String boxName = am.getUserData(account, "boxName");

            DcContext dc = new DcContext(baseUrl, cellName, schema, boxName);
            DcContext.setPlatform("android");

            String authToken = "";
            try {
                Accessor ac = dc.getAccessorWithAccount(cellName, account.name, password);
                Cell cell = ac.cell();
                authToken = ac.getAccessToken();

                Long expiresIn = ac.getExpiresIn().longValue();
                Long now = Calendar.getInstance().getTimeInMillis();
                Long expireDateTime = now + expiresIn * 1000;
                am.setUserData(account, "ExpiresIn", String.valueOf(expireDateTime));
            } catch (DaoException ex) {
                String respCode = ex.getCode();
                if (respCode.equals("0")) {
                    throw new NetworkErrorException("msg:" + respCode);
                } else {
                    final Bundle result = new Bundle();
                    result.putString(AccountManager.KEY_ERROR_CODE, respCode);
                    result.putString(AccountManager.KEY_ERROR_MESSAGE, "msg:" + respCode);
                    return result;
                }
            }

            if (!TextUtils.isEmpty(authToken)) {
                final Bundle result = new Bundle();
                result.putString(AccountManager.KEY_ACCOUNT_NAME, account.name);
                result.putString(AccountManager.KEY_ACCOUNT_TYPE, account.type);
                result.putString(AccountManager.KEY_AUTHTOKEN, authToken);
                return result;
            }
        }

        // final Intent intent = null; // TODO: Login intent
        // final Bundle bundle = new Bundle();
        // bundle.putParcelable(AccountManager.KEY_INTENT, intent);
        // return bundle;
        return null;
    }

    @Override
    public String getAuthTokenLabel(String authTokenType) {
        // null means we don't support multiple authToken types
        return null;
    }

    @Override
    public Bundle hasFeatures(AccountAuthenticatorResponse response, Account account, String[] features) {
        final Bundle result = new Bundle();
        result.putBoolean(AccountManager.KEY_BOOLEAN_RESULT, false);
        return result;
    }

    @Override
    public Bundle updateCredentials(AccountAuthenticatorResponse response, Account account, String authTokenType,
                    Bundle loginOptions) {
        return null;
    }
}

// Copyright (C) 2013 Polychrom Pty Ltd
//
// This program is licensed under the 3-clause "Modified" BSD license,
// see LICENSE file for full definition.

package jp.fukushima.namie.town.PcsAccountManagerPlugin;

import android.accounts.AbstractAccountAuthenticator;
import android.accounts.Account;
import android.accounts.AccountAuthenticatorResponse;
import android.accounts.AccountManager;
import android.accounts.NetworkErrorException;
import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import com.fujitsu.dc.client.DaoException;
import com.fujitsu.dc.client.DcContext;

public class Authenticator extends AbstractAccountAuthenticator
{
    private final Context ctx;

    public Authenticator(Context context)
    {
        super(context);
        ctx = context;
    }

    @Override
    public Bundle addAccount(AccountAuthenticatorResponse response, String accountType, String authTokenType, String[] requiredFeatures, Bundle options)
    {
        throw new UnsupportedOperationException();
    }

    @Override
    public Bundle confirmCredentials(AccountAuthenticatorResponse response, Account account, Bundle options)
    {
        return null;
    }

    @Override
    public Bundle editProperties(AccountAuthenticatorResponse response, String accountType)
    {
        throw new UnsupportedOperationException();
    }

    @Override
    public Bundle getAuthToken(AccountAuthenticatorResponse response, Account account, String authTokenType, Bundle loginOptions) throws NetworkErrorException
    {
        // If the caller requested an authToken type we don't support, then
        // return an error
        /*if(authTokenType isn't a supported auth token type)
        {
            final Bundle result = new Bundle();
            result.putString(AccountManager.KEY_ERROR_MESSAGE, "invalid authTokenType");
            return result;
        }*/

        // Extract the username and password from the Account Manager, and ask
        // the server for an appropriate AuthToken.
        final AccountManager am = AccountManager.get(ctx);
        final String password = am.getPassword(account);
        if (password != null)
        {
            String baseUrl = "https://fj.baas.jp.fujitsu.com/";
            String cellName = "kizuna01";
            String schema = "";
            String boxName = "data";
            DcContext dc = new DcContext(baseUrl, cellName, schema, boxName);
            String authToken = "";
            try {
                authToken = dc.asAccount(cellName, account.name, password).getAccessToken();
            } catch (DaoException e) {
                e.printStackTrace();
            };
            if (!TextUtils.isEmpty(authToken))
            {
                final Bundle result = new Bundle();
                result.putString(AccountManager.KEY_ACCOUNT_NAME, account.name);
                result.putString(AccountManager.KEY_ACCOUNT_TYPE, account.type);
                result.putString(AccountManager.KEY_AUTHTOKEN, authToken);
                return result;
            }
        }

        //final Intent intent = null; // TODO: Login intent
        //final Bundle bundle = new Bundle();
        //bundle.putParcelable(AccountManager.KEY_INTENT, intent);
        //return bundle;
        return null;
    }

    @Override
    public String getAuthTokenLabel(String authTokenType)
    {
        // null means we don't support multiple authToken types
        return null;
    }

    @Override
    public Bundle hasFeatures(AccountAuthenticatorResponse response, Account account, String[] features)
    {
        final Bundle result = new Bundle();
        result.putBoolean(AccountManager.KEY_BOOLEAN_RESULT, false);
        return result;
    }

    @Override
    public Bundle updateCredentials(AccountAuthenticatorResponse response, Account account, String authTokenType, Bundle loginOptions)
    {
        return null;
    }
}

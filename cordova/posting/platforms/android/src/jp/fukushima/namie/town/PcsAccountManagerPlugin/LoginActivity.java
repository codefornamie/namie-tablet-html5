/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package jp.fukushima.namie.town.PcsAccountManagerPlugin;

import com.fujitsu.dc.client.Accessor;
import com.fujitsu.dc.client.DaoException;
import com.fujitsu.dc.client.DcContext;

import android.accounts.AccountAuthenticatorActivity;
import android.accounts.AccountManager;
import android.accounts.Account;
import android.app.Activity;
import android.content.res.Resources;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class LoginActivity extends AccountAuthenticatorActivity  {

  AsyncLoginTask loginTask;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    loginTask = new AsyncLoginTask(this);

    String package_name = getApplication().getPackageName();
    Resources resources = getApplication().getResources();
    setContentView(resources.getIdentifier("activity_login", "layout", package_name));
    // setContentView(R.layout.activity_login);

    // final EditText usernameEdit = (EditText) findViewById(R.id.username);
    // final EditText passwordEdit = (EditText) findViewById(R.id.password);
    // Button button = (Button) findViewById(R.id.loginButton);
    final EditText usernameEdit = (EditText) findViewById(resources.getIdentifier("username", "id", package_name));
    final EditText passwordEdit = (EditText) findViewById(resources.getIdentifier("password", "id", package_name));
    Button button = (Button) findViewById(resources.getIdentifier("loginButton", "id", package_name));
    button.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        String username = usernameEdit.getText().toString();
        String password = passwordEdit.getText().toString();

        loginTask.execute(username, password);
        setResult(RESULT_OK);
        finish();
      }
    });
  }

  private boolean addAccount(String username, String password) {
    AccountManager accountManager = AccountManager.get(this);
    Account account = new Account(username, "jp.fukushima.namie.town.Pcs");

    Bundle userdata = new Bundle();
    userdata.putString("baseUrl", "https://test.namie-tablet.org/");
    userdata.putString("cellName", "kizuna01");
    userdata.putString("schema", "");
    userdata.putString("boxName", "data");

    return accountManager.addAccountExplicitly(account, toHashValue(password), userdata);
  }

  private String toHashValue(String src) {
    Encryption encryption = new Encryption("SHA-256");
    return encryption.toHashedString(src).substring(0, 32);
  }

  public class AsyncLoginTask extends AsyncTask<String, Void, Boolean> {
    private Activity loginActivity;
    private String username;
    private String password;

    public AsyncLoginTask(Activity activity) {
      this.loginActivity = activity;
    }

    @Override
    protected Boolean doInBackground(String... params) {
      String baseUrl = "https://test.namie-tablet.org/";
      String cellName = "kizuna01";
      String schema = "";
      String boxName = "data";

      this.username = params[0];
      this.password = params[1];

      try {
        DcContext dc = new DcContext(baseUrl, cellName, schema, boxName);
        DcContext.setPlatform("android");

        Accessor ac = dc.getAccessorWithAccount(cellName, username, toHashValue(password));
        ac.cell();
        return true;
      } catch (DaoException ex) {
        return false;
      }
    }

    @Override
    protected void onPostExecute(Boolean result) {
      if (!result) {
        showToast("Account registration was failed.");
      } else {
        if (addAccount(this.username, this.password)) {
          showToast("Account registration was successful.");
        } else {
          showToast("Account registration was failed.");
        }
      }
    }

    private void showToast(String msg) {
      Toast toast = Toast.makeText(this.loginActivity, msg, Toast.LENGTH_LONG);
      LinearLayout toastLayout = (LinearLayout) toast.getView();
      TextView toastTV = (TextView) toastLayout.getChildAt(0);
      toastTV.setTextSize(24);
      toast.show();
    }
  }
}

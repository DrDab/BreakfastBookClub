package routes.accauth;

import com.google.gson.JsonObject;
import daos.Account;
import spark.Request;
import spark.Response;
import spark.Route;
import utils.SQLTokenStore;

@Deprecated
public class LoginRoute implements Route {
    private final Account account;
    private final SQLTokenStore tokenStore;

    public LoginRoute(Account account, SQLTokenStore tokenStore) {
        this.account = account;
        this.tokenStore = tokenStore;
    }

    @Override
    public Object handle(Request request, Response response)  {
        JsonObject jsonObject = new JsonObject();

        String username = request.queryParams("username");
        String password = request.queryParams("password");

        if (username == null || password == null) {
            jsonObject.addProperty("status", "failure");
            return jsonObject;
        }

        String loginRes = account.login(username, password);

        if (loginRes.equals("User logged in.")) {
            jsonObject.addProperty("token", tokenStore.getUserToken(username));
            jsonObject.addProperty("status", "success");
        } else {
            jsonObject.addProperty("status", "failure");
            jsonObject.addProperty("failure_reason", loginRes);
        }

        return jsonObject;
    }
}

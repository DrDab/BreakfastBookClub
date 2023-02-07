package routes.accauth;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import spark.Request;
import spark.Response;
import spark.Route;
import utils.TokenStore;

public class LogoutRoute implements Route {
    private TokenStore tokenStore;

    public LogoutRoute(TokenStore tokenStore) {
        this.tokenStore = tokenStore;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject jsonObject = new JsonObject();

        String token = request.queryParams("token");

        if (token == null) {
            jsonObject.addProperty("status", "failure");
            return jsonObject;
        }

        jsonObject.addProperty("status", tokenStore.deauthToken(token));
        return jsonObject;
    }
}

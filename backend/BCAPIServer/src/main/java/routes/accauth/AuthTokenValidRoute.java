package routes.accauth;

import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Route;

public class AuthTokenValidRoute implements Route {
    private Gson gson;

    public AuthTokenValidRoute(Gson gson) {
        this.gson = gson;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        return null;
    }
}

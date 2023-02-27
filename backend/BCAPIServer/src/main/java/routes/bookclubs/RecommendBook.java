package routes.bookclubs;

import com.google.gson.JsonObject;
import spark.Request;
import spark.Response;
import spark.Route;

import java.sql.Connection;

public class RecommendBook implements Route {

    private Connection sqlConn;

    public RecommendBook() {

    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject respJson = new JsonObject();
        return respJson;


    }

}

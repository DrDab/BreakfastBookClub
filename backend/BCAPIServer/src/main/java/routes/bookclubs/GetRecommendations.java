package routes.bookclubs;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import daos.Books;
import spark.Request;
import spark.Response;
import spark.Route;

import java.sql.Connection;
import java.util.List;

public class GetRecommendations implements Route {

    private Connection sqlConn;

    public GetRecommendations(Connection sqlConn) {
        this.sqlConn = sqlConn;
    }
    @Override
    public Object handle(Request request, Response response) throws Exception{

        JsonObject respJson = new JsonObject();

        String searchRecepientID = request.queryParams("recipient_username");

        if (searchRecepientID == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "Need to provide userID for " +
                    "recipient of recommendations");
            return respJson.toString() + "\n";
        }

        List<String> bookRequests = new Books(sqlConn).bookRecommendations(searchRecepientID);
        respJson.add("bookIDs", new Gson().toJsonTree(bookRequests));
        respJson.addProperty("status", "success");
        return respJson.toString() + "\n";

    }
}

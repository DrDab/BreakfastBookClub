package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.gson.JsonObject;
import com.goofle.gson.Gson;
import daos.User;
import java.sql.Connection;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetSubscribedClubs implements Route {

    private FirebaseApp fbApp;
    private Connection sqlConn;

    public GetSubscribedClubs(FirebaseApp fbApp, Connection sqlConn) {
        this.fbApp = fbApp;
        this.sqlConn = sqlConn;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject respJson = new JsonObject();

        String user = request.queryParams("userId");

        if (use == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "Need to provide userId.");
            return respJson.toString() + "\n";
        }

        List<String> clubs = new User(user, sqlConn).allClubs();

        respJson.add("book_keys", new Gson().toJsonTree(clubs));
        respJson.addProperty("status", "success");
        return respJson.toString() + "\n";
    }
}
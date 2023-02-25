package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.gson.JsonObject;
import daos.User;
import daos.UserResult;
import java.sql.Connection;
import spark.Request;
import spark.Response;
import spark.Route;

public class JoinClub implements Route {

    private FirebaseApp fbApp;
    private Connection sqlConn;

    public JoinClub(FirebaseApp fbApp, Connection sqlConn) {
        this.fbApp = fbApp;
        this.sqlConn = sqlConn;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject respJson = new JsonObject();

        String user = request.queryParams("userId");
        String bookKey = request.queryParams("book_key");

        if (user == null || bookKey == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "Need to provide userId or book_key!");
            return respJson.toString() + "\n";
        }

        UserResult result = new User(user, sqlConn).joinClub(bookKey);

        if (result == UserResult.INVALID) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "Invalid userId or book_key.");
        } else if (result == UserResult.IMPOSSIBLE) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "User is already in book club.");
        } else if (result == UserResult.FAIL) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "Database error. Try again.");
        } else { // result == UserResult.SUCCESS
            respJson.addProperty("status", "success");
        }

        return respJson.toString() + "\n";
    }
}
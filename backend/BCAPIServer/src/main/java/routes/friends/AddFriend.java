package routes.friends;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import daos.User;
import daos.UserResult;
import spark.Request;
import spark.Response;
import spark.Route;

import java.sql.Connection;

public class AddFriend implements Route {

    private FirebaseApp fbApp;
    private Connection sqlConn;

    public AddFriend(FirebaseApp fbApp, Connection sqlConn) {
        this.fbApp = fbApp;
        this.sqlConn = sqlConn;
    }
    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject respJson = new JsonObject();

        String token = request.queryParams("token");
        String friendName = request.queryParams("friend_name");

        if (token == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "token is missing");
            return respJson.toString() + "\n";
        }

        if (friendName == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "friend_name is missing");
            return respJson.toString() + "\n";
        }

        User friend = new User(friendName, sqlConn);

        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(token, true);
        } catch (FirebaseAuthException e) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
            return respJson.toString() + "\n";
        }

        String uid = decodedToken.getUid();
        UserResult result = new User(uid, sqlConn).addFriend(friend);

        if (result != UserResult.SUCCESS) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", result.name());
            return respJson.toString() + "\n";
        }

        respJson.addProperty("status", "success");
        return respJson.toString() + "\n";
    }
}

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

public class RemoveFriend implements Route {

    private FirebaseApp fbApp;
    private Connection sqlConn;

    public RemoveFriend(FirebaseApp fbApp, Connection sqlConn) {
        this.fbApp = fbApp;
        this.sqlConn = sqlConn;
    }
    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject respJson = new JsonObject();

        String token = request.queryParams("token");
        String friendUID = request.queryParams("friend_userId");

        if (token == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "token is missing");
            return respJson.toString() + "\n";
        }

        if (friendUID == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "friend_userId is missing");
            return respJson.toString() + "\n";
        }

        User friend = new User(friendUID, sqlConn);

        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(token, true);
        } catch (FirebaseAuthException e) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
            return respJson.toString() + "\n";
        }

        String uid = decodedToken.getUid();
        UserResult result = new User(uid, sqlConn).unfriend(friend);

        if (result != UserResult.SUCCESS) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", result.name());
            return respJson.toString() + "\n";
        }

        respJson.addProperty("status", "success");
        return respJson.toString() + "\n";
    }
}

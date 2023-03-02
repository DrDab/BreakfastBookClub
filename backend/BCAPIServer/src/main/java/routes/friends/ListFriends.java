package routes.friends;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import daos.User;
import spark.Request;
import spark.Response;
import spark.Route;
import types.UserProfile;
import utils.FirebaseUtils;

import java.sql.Connection;
import java.util.List;

public class ListFriends implements Route {

    private FirebaseApp fbApp;
    private Connection sqlConn;

    public ListFriends(FirebaseApp fbApp, Connection sqlConn) {
        this.fbApp = fbApp;
        this.sqlConn = sqlConn;
    }
    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject respJson = new JsonObject();

        String uid = request.queryParams("user_id");
        if (uid == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "user_id is missing");
            return respJson.toString() + "\n";
        }

        List<String> friendsUIDs = new User(uid, sqlConn).allFriends();
        JsonArray friends = new JsonArray();

        for (String friendUID : friendsUIDs) {
            String friendUsername = FirebaseUtils.resolveBCUsername(fbApp, friendUID);
            if (friendUsername == null) {
                respJson.addProperty("status", "failure");
                respJson.addProperty("failure_reason", "Failed to resolve username");
                return respJson.toString() + "\n";
            }

            UserProfile profile = new User(friendUID, sqlConn).getUserProfile(friendUsername);
            friends.add(profile == null ? new Gson().toJsonTree(
                    new UserProfile(friendUID, friendUsername, null, null)) :
                    new Gson().toJsonTree(profile));
        }

        respJson.add("friends", friends);
        respJson.addProperty("status", "success");
        return respJson.toString() + "\n";
    }
}

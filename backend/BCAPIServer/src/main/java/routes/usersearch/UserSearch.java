package routes.usersearch;

import com.google.firebase.FirebaseApp;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.api.core.ApiFuture;
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
import java.util.ArrayList;

public class UserSearch implements Route {

    private FirebaseApp fbApp;
    private Connection sqlConn;

    public UserSearch(FirebaseApp fbApp, Connection sqlConn) {
        this.fbApp = fbApp;
        this.sqlConn = sqlConn;
    }
    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject respJson = new JsonObject();

        String userSearchTerm = request.queryParams("user_searchterm");
        if (userSearchTerm == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "user_searchterm is missing");
            return respJson.toString() + "\n";
        }

        Firestore db = FirestoreClient.getFirestore(fbApp);

        CollectionReference users = db.collection("users");
        Query query = users.whereGreaterThanOrEqualTo("name", userSearchTerm)
                           .whereLessThanOrEqualTo("name", userSearchTerm + "\uF7FF");

        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        List<QueryDocumentSnapshot> l = querySnapshot.get().getDocuments();

        List<String> userUIDs = new ArrayList<>();
        for (QueryDocumentSnapshot q : l) {
            userUIDs.add(q.getString("uid"));
        }

        JsonArray foundUsers = new JsonArray();

        for (String uid : userUIDs) {
            String username = FirebaseUtils.resolveBCUsername(fbApp, uid);

            if (username == null) {
              respJson.addProperty("status", "failure");
              respJson.addProperty("failure_reason", "Failed to resolve username");
              return respJson.toString() + "\n";
            }
            
            UserProfile profile = new User(uid, sqlConn).getUserProfile(username);
            foundUsers.add(profile == null ? new Gson().toJsonTree(
                new UserProfile(uid, username, null, null)) :
                new Gson().toJsonTree(profile));
        }

        respJson.add("users", foundUsers);
        respJson.addProperty("status", "success");
        return respJson.toString() + "\n";
    }
}

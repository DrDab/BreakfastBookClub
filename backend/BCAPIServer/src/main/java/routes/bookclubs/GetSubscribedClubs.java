package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import com.google.gson.Gson;
import daos.User;
import java.sql.Connection;
import java.util.List;
import java.util.ArrayList;
import spark.Request;
import spark.Response;
import spark.Route;
import types.Book;

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

        String token = request.queryParams("token");

        FirebaseToken decodedToken;

        try {
            decodedToken = FirebaseAuth.getInstance(fbApp)
                    .verifyIdToken(token, true);
        } catch (FirebaseAuthException e) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
            return respJson.toString() + "\n";
        }

        String uid = decodedToken.getUid();

        List<Book> clubs = new User(uid, sqlConn).allClubs();

        respJson.add("books", new Gson().toJsonTree(clubs));
        respJson.addProperty("status", "success");
        return respJson.toString() + "\n";
    }
}
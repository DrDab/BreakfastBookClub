package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import com.google.gson.Gson;
import daos.Books;
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
        
        String searchUID = request.queryParams("userId");

        if ((searchUID == null)) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "Need to provide userId!");
            return respJson.toString() + "\n";
        }

        List<Book> clubs = new User(searchUID, sqlConn).allClubs(new Books(sqlConn));

        respJson.add("books", new Gson().toJsonTree(clubs));
        respJson.addProperty("status", "success");
        return respJson.toString() + "\n";
    }
}
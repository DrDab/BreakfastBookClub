package routes.bookmgmt;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import daos.Books;
import daos.UserResult;
import spark.Request;
import spark.Response;
import spark.Route;
import utils.BCGsonUtils;

import java.sql.Connection;

public class SaveBook implements Route {

    FirebaseApp fbApp;
    private Connection sqlConn;
    public SaveBook(FirebaseApp fbApp, Connection sqlConn) {
        this.fbApp = fbApp;
        this.sqlConn = sqlConn;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject respJson = new JsonObject();

        JsonObject body = BCGsonUtils.fromStr(request.body());

        if (body == null) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", "Body is not valid JSON!");
            return respJson.toString() + "\n";
        }

        if (!body.has("token") || !body.has("book_key")) {
            respJson.addProperty("status", "failure");
            return respJson.toString() + "\n";
        }

        String token = body.get("token").getAsString();

        FirebaseToken decodedTokenSender;
        // authenticating user
        try {
            decodedTokenSender = FirebaseAuth.getInstance()
                    .verifyIdToken(token, true);
        } catch (FirebaseAuthException e) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
            return respJson.toString() + "\n";
        }
        String user = decodedTokenSender.getUid();
        String bookKey = body.get("book_key").getAsString();
        UserResult result = new Books(sqlConn).saveBook(user, bookKey);

        if (result != UserResult.SUCCESS) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", result.name());
            return respJson.toString() + "\n";
        }

        respJson.addProperty("status", "success");

        return respJson;
    }

}

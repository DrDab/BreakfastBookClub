package routes.bookclubs;

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
import utils.BCGsonUtils;

import java.sql.Connection;

public class RecommendBook implements Route {

    private FirebaseApp fbApp;
    private Connection sqlConn;

    public RecommendBook(FirebaseApp fbApp, Connection sqlConn) {
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

        // check to make sure request has necessary parameters
        if (!body.has("token_sender") || !body.has("token_recipient") ||
            !body.has("book_key")) {
            respJson.addProperty("status", "failure");
            return respJson.toString() + "\n";
        }

        String token_sender = body.get("token_sender").getAsString();
        String token_recipeint = body.get("token_recipient").getAsString();

        FirebaseToken decodedTokenSender;


        // authenticating user
        try {
            decodedTokenSender = FirebaseAuth.getInstance()
                    .verifyIdToken(token_sender, true);
        } catch (FirebaseAuthException e) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
            return respJson.toString() + "\n";
        }

        FirebaseToken decodedTokenRecipient;
        try {
            decodedTokenRecipient = FirebaseAuth.getInstance()
                    .verifyIdToken(token_recipeint, true);
        } catch (FirebaseAuthException e) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
            return respJson.toString() + "\n";
        }


        // getting usernames and book id and adding to the backend
        String senderUsername = decodedTokenSender.getUid();
        String recipientUsername = decodedTokenRecipient.getUid();
        String bookKey = body.get("book_key").getAsString();
        User sender = new User(senderUsername, sqlConn);
        User recipient = new User(recipientUsername, sqlConn);
        UserResult result = sender.recommend(recipient, bookKey);

        if (result != UserResult.SUCCESS) {
            respJson.addProperty("status", "failure");
            respJson.addProperty("failure_reason", result.name());
            return respJson.toString() + "\n";
        }

        respJson.addProperty("status", "success");
        return respJson;


    }

}

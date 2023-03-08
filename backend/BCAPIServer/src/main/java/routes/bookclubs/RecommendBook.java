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
import utils.SqlInitUtil;

public class RecommendBook implements Route {

  private FirebaseApp fbApp;
  private SqlInitUtil sqlInitUtil;

  public RecommendBook(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
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

    // check to make sure request has necessary parameters (token, recipient username, and book_key)
    if (!body.has("token") ||
        !body.has("recipient_userId") ||
        !body.has("book_key")) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Body doesn't have necessary parameters");
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

    // getting usernames and book id and adding to the backend
    String senderUsername = decodedTokenSender.getUid();
    String recipientUsername = body.get("recipient_userId").getAsString();
    String bookKey = body.get("book_key").getAsString();
    Connection sqlConn = sqlInitUtil.getSQLConnection();
    User sender = new User(senderUsername, sqlConn);
    User recipient = new User(recipientUsername, sqlConn);
    UserResult result = sender.recommend(recipient, bookKey);
    sqlConn.close();

    if (result != UserResult.SUCCESS) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", result.name());
      return respJson.toString() + "\n";
    }

    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";


  }

}

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

public class DeleteRecommendation implements Route {

  FirebaseApp fbApp;
  SqlInitUtil sqlInitUtil;

  public DeleteRecommendation(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String token = request.queryParams("token");
    String sender_id = request.queryParams("sender_userId");
    String bookKey = request.queryParams("book_key");

    if (token == null || sender_id == null || bookKey == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "token, sender id, and book key must be present!");
      return respJson.toString() + "\n";
    }

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

//        String sender_id = body.get("sender_userId").getAsString();
//        String bookKey = body.get("book_key").getAsString();
    String recipient_userId = decodedTokenSender.getUid();
    Connection sqlConn = sqlInitUtil.getSQLConnection();
    UserResult result = new User(recipient_userId, sqlConn).deleteRecommendation(sender_id,
        bookKey);
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

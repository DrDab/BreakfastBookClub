package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import daos.User;
import daos.UserResult;
import java.sql.Connection;
import spark.Request;
import spark.Response;
import spark.Route;
import utils.SqlInitUtil;

public class UnjoinClub implements Route {

  private FirebaseApp fbApp;
  private SqlInitUtil sqlInitUtil;

  public UnjoinClub(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String token = request.queryParams("token");
    String bookKey = request.queryParams("book_key");

    if (token == null || bookKey == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Need to provide token and book_key!");
      return respJson.toString() + "\n";
    }

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

    Connection sqlConn = sqlInitUtil.getSQLConnection();
    UserResult result = new User(uid, sqlConn).leaveClub(bookKey);

    if (result == UserResult.INVALID) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Invalid userId or book_key.");
    } else if (result == UserResult.IMPOSSIBLE) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "User is not in book club.");
    } else if (result == UserResult.FAIL) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Database error. Try again.");
    } else { // result == UserResult.SUCCESS
      respJson.addProperty("status", "success");
    }

    return respJson.toString() + "\n";
  }
}
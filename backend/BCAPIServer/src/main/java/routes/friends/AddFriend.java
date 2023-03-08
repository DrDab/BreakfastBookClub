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
import utils.SqlInitUtil;

public class AddFriend implements Route {

  private FirebaseApp fbApp;
  private SqlInitUtil sqlInitUtil;

  public AddFriend(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
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

    Connection sqlConn = sqlInitUtil.getSQLConnection();
    User friend = new User(friendUID, sqlConn);

    FirebaseToken decodedToken;
    try {
      decodedToken = FirebaseAuth.getInstance().verifyIdToken(token, true);
    } catch (FirebaseAuthException e) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
      sqlConn.close();;
      return respJson.toString() + "\n";
    }

    String uid = decodedToken.getUid();
    UserResult result = new User(uid, sqlConn).addFriend(friend);

    if (result != UserResult.SUCCESS) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", result.name());
      sqlConn.close();
      return respJson.toString() + "\n";
    }

    sqlConn.close();

    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}

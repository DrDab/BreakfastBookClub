package routes.profile;

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

public class SetUserProfile implements Route {

  private FirebaseApp fbApp;
  private SqlInitUtil sqlInitUtil;

  public SetUserProfile(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String token = request.queryParams("token");

    FirebaseToken decodedToken;

    try {
      decodedToken = FirebaseAuth.getInstance()
          .verifyIdToken(token, true);
    } catch (FirebaseAuthException e) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
      return respJson.toString() + "\n";
    }

    String uid = decodedToken.getUid();

    Connection sqlConn = sqlInitUtil.getSQLConnection();
    User user = new User(uid, sqlConn);

    if (!user.userProfileExists()) {
      UserResult createRes = user.createUserProfile();
      if (createRes != UserResult.SUCCESS) {
        respJson.addProperty("status", "failure");
        respJson.addProperty("failure_reason", createRes.name());
        sqlConn.close();
        return respJson.toString() + "\n";
      }
    }

    String bio = request.queryParams("bio");
    UserResult result = user.updateUserProfile(null, bio, null);

    if (result != UserResult.SUCCESS) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", result.name());
      sqlConn.close();
      return respJson.toString() + "\n";
    }

    respJson.addProperty("status", "success");
    sqlConn.close();
    return respJson.toString() + "\n";
  }
}

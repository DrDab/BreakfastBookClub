package routes.profile;

import com.google.firebase.FirebaseApp;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import daos.User;
import java.sql.Connection;
import spark.Request;
import spark.Response;
import spark.Route;
import types.UserProfile;
import utils.FirebaseUtils;
import utils.SqlInitUtil;

public class GetUserProfile implements Route {

  private FirebaseApp fbApp;
  private SqlInitUtil sqlInitUtil;

  public GetUserProfile(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String searchUserId = request.queryParams("userId");
    if (searchUserId == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "userId is missing!");
      return respJson.toString() + "\n";
    }

    String username = FirebaseUtils.resolveBCUsername(fbApp, searchUserId);
    if (username == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Failed to resolve username");
      return respJson.toString() + "\n";
    }

    Connection sqlConn = sqlInitUtil.getSQLConnection();
    UserProfile profile = new User(searchUserId, sqlConn).getUserProfile(username);
    respJson.add("user", profile == null ? new Gson().toJsonTree(
        new UserProfile(searchUserId, username, null, null)) :
        new Gson().toJsonTree(profile));

    sqlConn.close();
    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}

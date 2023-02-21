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

public class GetUserProfile implements Route {

  private FirebaseApp fbApp;
  private Connection sqlConn;

  public GetUserProfile(FirebaseApp fbApp, Connection sqlConn) {
    this.fbApp = fbApp;
    this.sqlConn = sqlConn;
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

    UserProfile profile = new User(searchUserId, sqlConn).getUserProfile(username);
    respJson.add("user", profile == null ? new Gson().toJsonTree(
        new UserProfile(searchUserId, username, null, null)) :
        new Gson().toJsonTree(profile));

    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}

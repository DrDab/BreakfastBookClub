package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import daos.Books;
import daos.User;
import java.sql.Connection;
import java.util.List;
import spark.Request;
import spark.Response;
import spark.Route;
import types.UserProfile;
import utils.FirebaseUtils;
import utils.SqlInitUtil;

public class GetMembers implements Route {

  private FirebaseApp fbApp;
  private SqlInitUtil sqlInitUtil;

  public GetMembers(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String searchBookKey = request.queryParams("book_key");
    if (searchBookKey == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "book_key is missing!");
      return respJson.toString() + "\n";
    }

    Connection sqlConn = sqlInitUtil.getSQLConnection();
    List<String> clubUIDs = new Books(sqlConn).bookClubUsers(searchBookKey);
    JsonArray members = new JsonArray();

    for (String uid : clubUIDs) {
      String username = FirebaseUtils.resolveBCUsername(fbApp, uid);
      if (username == null) {
        respJson.addProperty("status", "failure");
        respJson.addProperty("failure_reason", "Failed to resolve username");
        return respJson.toString() + "\n";
      }

      UserProfile profile = new User(uid, sqlConn).getUserProfile(username);
      members.add(profile == null ? new Gson().toJsonTree(
          new UserProfile(uid, username, null, null)) :
          new Gson().toJsonTree(profile));
    }

    respJson.add("members", members);
    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}

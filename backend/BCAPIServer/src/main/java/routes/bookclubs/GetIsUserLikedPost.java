package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import daos.User;
import java.sql.Connection;
import java.sql.SQLException;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetIsUserLikedPost implements Route {

  private FirebaseApp fbApp;
  private Connection sqlConn;

  public GetIsUserLikedPost(FirebaseApp fbApp, Connection sqlConn) {
    this.fbApp = fbApp;
    this.sqlConn = sqlConn;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String userId = request.queryParams("user_id");
    String postId = request.queryParams("post_id");

    if (userId == null || postId == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "user_id && post_id must be present!");
      return respJson;
    }

    try {
      int isUserLikedPost = new User(userId, sqlConn).getNumLikesFromUser(postId);
      respJson.addProperty("status", "success");
      respJson.addProperty("isUserLikedPost", String.valueOf(isUserLikedPost));
      
    } catch (SQLException e) {
      e.printStackTrace();
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", e.getMessage());
    }

    return respJson.toString() + "\n";
  }
}

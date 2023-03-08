package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import daos.Posts;
import daos.User;
import daos.UserResult;
import java.sql.Connection;
import java.sql.SQLException;
import spark.Request;
import spark.Response;
import spark.Route;
import utils.SqlInitUtil;

public class LikePost implements Route {

  private FirebaseApp fbApp;
  private SqlInitUtil sqlInitUtil;

  public LikePost(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String token = request.queryParams("token");
    String postId = request.queryParams("post_id");

    if (postId == null) { // || token == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "post_id must be present!");
      return respJson;
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

    try {
      Connection sqlConn = sqlInitUtil.getSQLConnection();
      UserResult res = new User(uid, sqlConn).likePost(postId);
      respJson.addProperty("status", res == UserResult.SUCCESS ? "success" : "failure");
      if (res != UserResult.SUCCESS) {
        respJson.addProperty("failure_reason", String.valueOf(res));
      }
    } catch (SQLException e) {
      e.printStackTrace();
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", e.getMessage());
    }

    return respJson.toString() + "\n";
  }
}

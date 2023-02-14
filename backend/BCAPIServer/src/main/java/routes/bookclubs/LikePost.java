package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import daos.Posts;
import java.sql.Connection;
import spark.Request;
import spark.Response;
import spark.Route;

public class LikePost implements Route {

  private FirebaseApp fbApp;
  private Connection sqlConn;

  public LikePost(FirebaseApp fbApp, Connection sqlConn) {
    this.fbApp = fbApp;
    this.sqlConn = sqlConn;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String token = request.queryParams("token");
    String postId = request.queryParams("post_id");

    if (token == null || postId == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "token and post_id must be present!");
      return respJson;
    }

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

    return new Posts(sqlConn).likePostByID(postId);
  }
}

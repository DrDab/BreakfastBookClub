package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import com.mysql.cj.x.protobuf.MysqlxCrud;
import daos.Posts;
import daos.UserResult;
import spark.Request;
import spark.Response;
import spark.Route;

import java.sql.Connection;
import utils.SqlInitUtil;

public class DeletePost implements Route {

  FirebaseApp fbApp;
  SqlInitUtil sqlInitUtil;

  public DeletePost(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();
    String token = request.queryParams("token");
    String postID = request.queryParams("postId");
    if (postID == null || token == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "post_id and token must be present!");
      return respJson;
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

    String userID = decodedTokenSender.getUid();
    Connection sqlConn = sqlInitUtil.getSQLConnection();
    UserResult result = new Posts(sqlConn).deletePost(userID, postID);
    if (result != UserResult.SUCCESS) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", result.name());
      return respJson.toString() + "\n";
    }

    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }

}

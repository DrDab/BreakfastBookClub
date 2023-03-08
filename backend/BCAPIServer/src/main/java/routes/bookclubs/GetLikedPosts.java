package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import daos.Books;
import daos.User;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import spark.Request;
import spark.Response;
import spark.Route;
import types.BookPost;
import utils.BCGsonUtils;
import utils.SqlInitUtil;

public class GetLikedPosts implements Route {

  private FirebaseApp fbApp;
  private SqlInitUtil sqlInitUtil;

  public GetLikedPosts(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String userId = request.queryParams("user_id");

    if (userId == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "user_id must be present!");
      return respJson;
    }

    try {
      Connection sqlConn = sqlInitUtil.getSQLConnection();
      List<BookPost> posts = new User(userId, sqlConn).getLikedPosts();
      respJson.addProperty("status", posts == null ? "failure" : "success");
      if (posts != null) {
        respJson.add("posts",
            BCGsonUtils.getPostsJsonArrFromList(new Books(sqlConn), fbApp, posts));
      }
      sqlConn.close();
    } catch (SQLException e) {
      e.printStackTrace();
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", e.getMessage());
    }

    return respJson.toString() + "\n";
  }
}

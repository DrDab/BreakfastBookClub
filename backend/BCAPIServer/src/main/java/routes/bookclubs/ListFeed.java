package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import daos.Books;
import daos.User;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import spark.Request;
import spark.Response;
import spark.Route;
import types.Book;
import types.BookPost;

import java.util.List;
import utils.BCGsonUtils;
import utils.ResultSetParsers;

public class ListFeed implements Route {

  private FirebaseApp fbApp;
  private Connection sqlConn;

  public ListFeed(FirebaseApp fbApp, Connection sqlConn) {
    this.fbApp = fbApp;
    this.sqlConn = sqlConn;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String token = request.queryParams("token");
    if (token == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Expected fields are missing!");
      return respJson.toString() + "\n";
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
    User user = new User(uid, sqlConn);

    JsonArray postsArr = BCGsonUtils.getPostsJsonArrFromList(fbApp, user.getUserFeedPosts());
    respJson.add("posts", postsArr);
    respJson.addProperty("status", "success");
    return respJson;
  }
}

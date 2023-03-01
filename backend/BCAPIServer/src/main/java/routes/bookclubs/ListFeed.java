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
import spark.Request;
import spark.Response;
import spark.Route;
import types.BookPost;

import java.util.List;
import utils.BCGsonUtils;

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
    User users = new User(uid, sqlConn);
    Books books = new Books(sqlConn);

    List<String> subscribedBookKeys = users.getSubscribedClubs();
    JsonArray postsArr = new JsonArray();

    for (String bookKey : subscribedBookKeys) {
      List<BookPost> posts = books.listBookPosts(bookKey);
      JsonArray bookPostsArr = BCGsonUtils.getPostsJsonArrFromList(fbApp, posts);
      postsArr.addAll(bookPostsArr);
    }

    respJson.add("posts", postsArr);
    respJson.addProperty("status", "success");
    return respJson;
  }
}

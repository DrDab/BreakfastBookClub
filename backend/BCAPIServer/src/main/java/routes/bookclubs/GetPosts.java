package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import daos.Books;
import daos.Posts;
import daos.User;
import java.sql.Connection;
import java.util.List;
import spark.Request;
import spark.Response;
import spark.Route;
import types.BookPost;
import utils.FirebaseUtils;
import utils.OpenLibraryAPI;

public class GetPosts implements Route {

  private FirebaseApp fbApp;
  private Connection sqlConn;

  public GetPosts(FirebaseApp fbApp, Connection sqlConn) {
    this.fbApp = fbApp;
    this.sqlConn = sqlConn;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String searchUID = request.queryParams("uid");
    String searchBookKey = request.queryParams("book_key");

    if ((searchUID != null && searchBookKey != null)) {// ||
      //(searchUID == null && searchBookKey == null)) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", (searchUID != null && searchBookKey != null) ?
          "Should only provide uid or book_key!" : "Need to provide uid xor book_key!");
      return respJson.toString() + "\n";
    }

    List<BookPost> posts =
        (searchUID == null && searchBookKey == null) ? new Posts(sqlConn).listAllPosts() :
            searchUID != null ? new User(searchUID, sqlConn).getUserPosts()
                : new Books(sqlConn).listBookPosts(searchBookKey);

    JsonArray postsArr = new JsonArray();
    Gson gson = new Gson();

    for (BookPost post : posts) {
      JsonObject postJson = new JsonObject();
      postJson.addProperty("book_id", post.bookKey);
      postJson.addProperty("title", post.postTitle);
      postJson.add("book", gson.toJsonTree(OpenLibraryAPI.getBookByKey(post.bookKey)));

      JsonObject userObj = new JsonObject();
      userObj.addProperty("userId", post.userId);
      userObj.addProperty("username", FirebaseUtils.resolveBCUsername(fbApp, post.userId));
      userObj.addProperty("bio", "");
      userObj.addProperty("thumbnail", "");
      postJson.add("user", userObj);

      postJson.addProperty("title", post.postTitle);
      postJson.addProperty("date", post.date);
      postJson.addProperty("tag", post.tag);
      postJson.addProperty("post", post.post);
      postJson.addProperty("likes", post.likes);

      postsArr.add(postJson);
    }

    respJson.add("posts", postsArr);
    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}

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
import utils.BCGsonUtils;
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

    String searchUID = request.queryParams("userId"); // url: api/ asdfjals/ ?userid=
    String searchBookKey = request.queryParams("book_key");

    if ((searchUID != null && searchBookKey != null)) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Need to provide userId or book_key!");
      return respJson.toString() + "\n";
    }

    List<BookPost> posts =
        (searchUID == null && searchBookKey == null) ? new Posts(sqlConn).listAllPosts() :
            searchUID != null ? new User(searchUID, sqlConn).getUserPosts()
                : new Books(sqlConn).listBookPosts(searchBookKey);

    JsonArray postsArr = BCGsonUtils.getPostsJsonArrFromList(fbApp, posts);

    respJson.add("posts", postsArr);
    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}
